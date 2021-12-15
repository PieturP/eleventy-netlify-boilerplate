const dotenv = require('dotenv');
const Cache = require("@11ty/eleventy-cache-assets");
const options = require('./fetchOptions');
dotenv.config();

module.exports = async () => {

  const resp = await Cache(
    `${process.env.DIRECTUS_API_HOST}/items/collection` +
    `?fields=*,books.book_id.*,books.book_id.images.image_id.*`,
    options
  );

  let books = [];
  for( let item of resp.data) {
    item.books.forEach(book => {
      if (book.book_id) {
        books.push(book.book_id);
      }
    })
  }
  return books;
};