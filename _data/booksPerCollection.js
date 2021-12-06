const dotenv = require('dotenv');
const Cache = require("@11ty/eleventy-cache-assets");
const lodashChunk = require('lodash/chunk');
const slugify = require("@sindresorhus/slugify");
const options = require('./fetchOptions');

module.exports = async () => {

  dotenv.config();

  const resp = await Cache(
    `${process.env.DIRECTUS_API_HOST}/items/collection` +
    `?fields=*,books.book_id.*,books.book_id.images.image_id.*`,
    options
  );

  const collections = resp.data;
  // console.log(collections)


  // /*
  // let booksPerCollection = [];
  const paginationSize = 3;

  let tagMap = [];

  // for (let spe of specimina) {
  //   booksPerSpecimina[spe] = books.filter(book => book.specimina.includes(spe));
  // }

  for( let item of collections) {
    let tagItems = item.books.filter(b => b.book_id !== null);

    let pagedItems = lodashChunk(tagItems, paginationSize);
    for( let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
      tagMap.push({
        tagName: slugify(item.title),
        pageNumber: pageNumber,
        pageData: pagedItems[pageNumber]
      });
    }
  }

  return tagMap;




  // let tagSet = new Set();
  // books.map(function(item) {
  //   console.log(item);
  // 	// if( "spe" in item.specimina ) {
  // 	// 	let tags = item.data.tags;

  // 	// 	// optionally filter things out before you iterate over?
  // 	// 	for (let tag of tags) {
  // 	// 		tagSet.add(tag);
  // 	// 	}

  // 	// }
  // });

  // // Get each item that matches the tag
  // let paginationSize = 3;
  // let tagMap = [];
  // let tagArray = [...tagSet];
  // for( let tagName of tagArray) {
  // 	let tagItems = collection.getFilteredByTag(tagName);
  // 	let pagedItems = lodashChunk(tagItems, paginationSize);
  // 	// console.log( tagName, tagItems.length, pagedItems.length );
  // 	for( let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
  // 		tagMap.push({
  // 			tagName: tagName,
  // 			pageNumber: pageNumber,
  // 			pageData: pagedItems[pageNumber]
  // 		});
  // 	}
  // }

  // /* return data looks like:
  // 	[{
  // 		tagName: "tag1",
  // 		pageNumber: 0
  // 		pageData: [] // array of items
  // 	},{
  // 		tagName: "tag1",
  // 		pageNumber: 1
  // 		pageData: [] // array of items
  // 	},{
  // 		tagName: "tag1",
  // 		pageNumber: 2
  // 		pageData: [] // array of items
  // 	},{
  // 		tagName: "tag2",
  // 		pageNumber: 0
  // 		pageData: [] // array of items
  // 	}]
  //  */
  // //console.log( tagMap );
  // return tagMap;


};