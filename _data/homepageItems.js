const dotenv = require('dotenv');
const Cache = require("@11ty/eleventy-cache-assets");
const options = require('./fetchOptions');

module.exports = async () => {

  dotenv.config();

  const resp = await Cache(
    `${process.env.DIRECTUS_API_HOST}/items/Homepage`
    +`?fields=items.item:collection.*,items.item:snippets.name,items.item:snippets.content,items.collection`
  , options);


  return resp.data
};