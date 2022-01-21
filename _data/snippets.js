require('dotenv').config();
const Cache = require("@11ty/eleventy-cache-assets");
const options = require('./fetchOptions');

module.exports = async() => {
    const resp = await Cache(
        `${process.env.DIRECTUS_API_HOST}/items/snippets` +
        `?fields=name,content`, options);
    return resp.data
};