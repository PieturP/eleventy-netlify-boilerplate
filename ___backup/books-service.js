const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const env = process.env;

const HEADERS = {
  headers: {
    'Authorization': `Bearer ${env.DIRECTUS_API_TOKEN}`
  }
}

const getBook = async (id) => {
  if (!id) { return }

  try {
    const data = await axios.get(
      `${env.DIRECTUS_API_HOST}/items/booksdata/${id}?fields=*,images.image_id.*`
      , HEADERS);
    console.log('book found', data);
    return data.data

  } catch (error) {
    if (error.response) {
      console.log(error.response);
      console.log(error.response.status);
    }
  }
}



const searchBooks = async (query, offset = 0, pageSize = 10) => {

  if (!query || !Object.keys(query).length) {
    return
  }

  let params = new URLSearchParams();

  for(const key in query ) {
    if (query[key]) {
      params.append(`filter[${key}][_contains]`, query[key].trim())
    }
  };
  params.append('filter[stock][_gt]', 0);
  params.append('fields', `*,images.image_id.*`);
  params.append('limit', pageSize);
  params.append('offset', offset * pageSize);
  params.append('meta', 'filter_count');

  try {
    const url =  `${env.DIRECTUS_API_HOST}/items/booksdata/?${params.toString()}`
    const resp = await axios.get(url, HEADERS);
    return resp.data

  } catch (error) {
    if (error.response) {
      // console.log(error.response);
      console.log('ERROR SARCHINGN BOOKS')
      console.log(error.response);
    }
  }



}

module.exports = {
  getBook,
  searchBooks
}
