require('dotenv').config();
const Cache = require("@11ty/eleventy-cache-assets");
const lodashChunk = require('lodash/chunk');
const slugify = require("@sindresorhus/slugify");
const options = require('./fetchOptions');

module.exports = async () => {
  const resp = await Cache(
    `${process.env.DIRECTUS_API_HOST}/items/collection` +
    `?fields=*,books.book_id.*,books.book_id.images.image_id.*`,
    options
  );

  const collections = resp.data;
  const paginationSize = 10;

  let tagMap = [];

  for( let item of collections) {
    let tagItems = item.books.filter(b => b.book_id !== null);

    let pagedItems = lodashChunk(tagItems, paginationSize);
    for( let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
      tagMap.push({
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        header: item.header,

        tagName: slugify(item.title),
        pageNumber: pageNumber,
        pageData: pagedItems[pageNumber]
      });
    }
  }

  return tagMap;
};