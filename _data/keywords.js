const dotenv = require('dotenv');
const Cache = require("@11ty/eleventy-cache-assets");
const options = require('./fetchOptions');

module.exports = async () => {

  dotenv.config();

  const resp = await Cache(
    `${process.env.DIRECTUS_API_HOST}/items/keywords?fields=id,name&sort=name`
  , options);

  return resp.data
};