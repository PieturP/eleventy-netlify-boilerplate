const dotenv = require('dotenv');
const Cache = require("@11ty/eleventy-cache-assets");
const lodashChunk = require('lodash/chunk');

module.exports = async () => {

  dotenv.config();

  const resp = await Cache(`${process.env.DIRECTUS_API_HOST}/specimina`, {
    duration: '1h',
    type: 'json'
  });

  const books =  resp.books;
  const specimina = resp.specimina.sort();
  // let booksPerSpecimina = [];
	const paginationSize = 10;

  let tagMap = [];

  // for (let spe of specimina) {
  //   booksPerSpecimina[spe] = books.filter(book => book.specimina.includes(spe));
	// }

	for( let spe of specimina) {
		let tagItems = books.filter(b => b.specimina.includes(spe));
		let pagedItems = lodashChunk(tagItems, paginationSize);
		for( let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
			tagMap.push({
				tagName: `specimina-${spe}`,
				pageNumber: pageNumber,
				pageData: pagedItems[pageNumber]
			});
		}
  }

	// console.log(tagMap);
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