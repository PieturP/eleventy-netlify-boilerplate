const dotenv = require('dotenv');
const Cache = require("@11ty/eleventy-cache-assets");
const options = require('./fetchOptions');

module.exports = async () => {
  dotenv.config();
  const params = new URLSearchParams();
  params.append('baseUrl', `${process.env.ROOT_DOMAIN}/books`)
  return await Cache(
    `${process.env.DIRECTUS_API_HOST}/sitemap?${params.toString()}`,
    {...options, type: 'buffer'}
  );
};
