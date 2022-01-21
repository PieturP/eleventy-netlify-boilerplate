require('dotenv').config();
const Cache = require("@11ty/eleventy-cache-assets");
const options = require('./fetchOptions');

module.exports = async () => {
  const resp = await Cache(`${process.env.DIRECTUS_API_HOST}/specimina`, options);
  return resp.specimina.sort().reverse();
};
