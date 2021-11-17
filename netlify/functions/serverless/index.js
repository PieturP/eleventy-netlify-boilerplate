const { EleventyServerless } = require("@11ty/eleventy");
require("./eleventy-bundler-modules.js");
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const PAGE_SIZE = 10;
const HEADERS = {
  headers: {
    'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
  }
}
const getDefaultParams = () => {
  let params = new URLSearchParams();
  params.append('filter[stock][_gt]', 0);
  params.append('fields', `*,images.image_id.*,keywords.keyword_id.id,keywords.keyword_id.name,keywords.keyword_id.visible`);
  params.append('meta', 'filter_count');
  return params;
}


///////////////////////////////
//
//  Actual (Serverless) Functions
//
///////////////////////////////



/**
 * getBook
 * @param {*} bookId
 */
const getBook = async (id) => {
  if (!id) { return }

  try {
    const params = getDefaultParams();
    const url =  `${process.env.DIRECTUS_API_HOST}/items/booksdata/${id}?${params.toString()}`
    const data = await axios.get(url, HEADERS);
    console.log('URL: ', url);
    return data.data

  } catch (error) {
    if (error.response) {
      console.log(error.response);
      console.log(error.response.status);
    }
  }
}


/**
 * searchBooks
 * @param {*} query
 * @param {*} offset
 * @param {*} pageSize
 * @returns
 */
const searchBooks = async (query, offset = 0, pageSize = 10) => {

  if (!query || !Object.keys(query).length) {
    return
  }

  const params = getDefaultParams();

  // keywords need relational data filtering:
  if (query.keyword) {
    params.append('filter[keywords][keyword_id][id]', query.keyword.trim());
    // ..or less specific via params.append('filter[keywords][keyword_id]', query.keyword.trim()); ?
  }

  // other query parameters:
  for(const key in query ) {
    if (query[key] && key !== 'keyword') {
      params.append(`filter[${key}][_contains]`, query[key].trim())
    }
  };

  if (offset) {
    params.append('offset', offset * pageSize);
  }
  params.append('limit', pageSize);

  try {
    const url =  `${process.env.DIRECTUS_API_HOST}/items/booksdata/?${params.toString()}`
    const resp = await axios.get(url, HEADERS);
    return resp.data

  } catch (error) {
    if (error.response) {
      console.log('ERROR Searching books')
      console.log(error.response.status, error.response.statusText);
    }
  }
}


/**
 * λ handler
 * @param {*} event
 * @returns
 */
const handler = async (event) => {
  const path = event.path.split('/');
  const route = path[path.length - 2];

  // console.log({
  //   query: event.queryStringParameters,
  //   path: event.path,
  //   route: route
  // })

  let elev = new EleventyServerless("serverless", {
    path: event.path,
    query: event.queryStringParameters,
    functionsDir: "./netlify/functions/",
    config: (eleventyConfig) => {

      // @FIXME @TODO: Should this indeed be done in the serverless config?
      // It seemd this could also be done before?...

      eleventyConfig.dataFilterSelectors.add("authors");
      if (route === "search") {

        let query = event.queryStringParameters;
        let nav = {};
        const page = parseInt(query.page, 10) || 1;
        delete query.page

        eleventyConfig.addGlobalData("fetchedBooks", async() => {
          const resp = await searchBooks(query, (page-1), PAGE_SIZE);
          const q = new URLSearchParams(query);
          if (!resp) {
            return
          }
          if (resp.meta.filter_count > PAGE_SIZE) {
            nav.next = `/search/?${q}&page=${page + 1}`;
          }
          if (page > 1) {
            nav.previous = `/search/?${q}&page=${page - 1}`;
          }
          if (nav.next || nav.previous) {
            resp.nav = nav;
          }
          return resp;
        });
      }
      if (route === "books") {
        const bookId = path[path.length - 1];
        eleventyConfig.addGlobalData("fetchedBook", async () => await getBook(bookId) );
      }
      // if (route === 'about') {
        // console.log('about!!');
      // }
    }
  });

  try {
    let [page] = await elev.getOutput();

    // If you want some of the data cascade available in `page.data`, use `eleventyConfig.dataFilterSelectors`.
    // Read more: https://www.11ty.dev/docs/config/#data-filter-selectors

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
      },
      body: page.content,
    };
  } catch (error) {
    // Only console log for matching serverless paths
    // (otherwise you’ll see a bunch of BrowserSync 404s for non-dynamic URLs during --serve)
    if (elev.isServerlessUrl(event.path)) {
      console.log("Serverless Error:", error);
    }

    return {
      statusCode: error.httpStatusCode || 500,
      body: JSON.stringify( {
          error: error.message,
        }, null, 2)
    };
  }
}

//const { builder } = require("@netlify/functions");
//exports.handler = builder(handler);
