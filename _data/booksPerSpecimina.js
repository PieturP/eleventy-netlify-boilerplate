require('dotenv').config();
const Cache = require("@11ty/eleventy-cache-assets");
const lodashChunk = require('lodash/chunk');
const options = require('./fetchOptions');

module.exports = async () => {

  const resp = await Cache(`${process.env.DIRECTUS_API_HOST}/specimina`, options);
  const books = resp.books;
  const specimina = resp.specimina.sort();
  const paginationSize = 10;
  // let booksPerSpecimina = [];

  let tagMap = [];

  for (let spe of specimina) {
    let tagItems = books.filter(b => b.specimina.includes(spe));
    let pagedItems = lodashChunk(tagItems, paginationSize);
    for (let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
      tagMap.push({
        tagName: spe,
        pageNumber: pageNumber,
        pageData: pagedItems[pageNumber]
      });
    }
  }
  return tagMap;
};