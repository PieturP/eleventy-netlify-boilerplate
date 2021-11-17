const dotenv = require('dotenv');
const Cache = require("@11ty/eleventy-cache-assets");
const axios = require('axios');

module.exports = async () => {

  dotenv.config();
  const env = process.env;

  const fetchBookById = async (id) => {
    if (!id) { return }

    const env = process.env;

    const data = await axios.get([
      `${env.DIRECTUS_API_HOST}/items/booksdata/${id}?fields=*,images.image_id.*`
    ].join(''),
    {
      headers: {
        'Authorization': `Bearer ${env.DIRECTUS_API_TOKEN}`
      }
    });

    return data.data.data
  }

  const data = await axios.get([
    `${env.DIRECTUS_API_HOST}/items/booksdata?filter[stock][_gt]=1`,
      `&filter[is_new][_eq]=1`,
      `&limit=20`,
      `&page=2`,
      `&fields=*,images.image_id.*,keywords.*.*`,
  ].join('')
  ,{
    headers: {
      'Authorization': `Bearer ${env.DIRECTUS_API_TOKEN}`
    }
  });

  return {
    booksData: data.data.data,
    fetchBookById,
    IMAGE_HOST: env.DIRECTUS_API_HOST
  }
};