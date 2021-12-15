const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


async function updateBook(book) {
  // const options = {
  //   headers: {
  //     'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
  //   }
  // }
  // try {
  //   const resp = await axios.get(
  //     `${process.env.DIRECTUS_API_HOST}/items/booksdata/${book.id}`
  //     + `?filter[stock][_gte]=1`
  //     + `&fields=id,price,weight,title`
  //   , options);
  //   return resp.data.data;
  // } catch (e) {
  //   console.log(e);
  //   throw new Error(`Item "${book.name}" not found or out of stock`);
  // }
}


exports.handler = async function (event) {
  console.log('After Order Hook');
  console.log(event);

  // 1. Grab postData from event
  try {
    const postData = JSON.parse(event.body).content;

    console.log(postData);

    const response = {
      'result': 'success',
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( response )
    }

  } catch (e) {
    console.log(e);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Error calculating shipment costs. ' + e.message,
      }),
    };
  }
};