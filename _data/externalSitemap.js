const dotenv = require('dotenv');
const Cache = require("@11ty/eleventy-cache-assets");
const options = require('./fetchOptions');

module.exports = async () => {
  dotenv.config();
  const params = new URLSearchParams();
  params.append('baseUrl', `${process.env.ROOT_DOMAIN}/books`)
  const url = `${process.env.DIRECTUS_API_HOST}/sitemap?${params.toString()}`
  console.log('external sitemap fetching', url);
  return await Cache(
    url,
    {...options, type: 'buffer'}
  );
};
