const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function verifyRequestToken(token) {
  const resp = await axios.get(`https://app.snipcart.com/api/requestvalidation/${token}`, {
    headers: {
      accept: 'application/json'
    },
    auth: {
      username :`${(process.env.SNIPCART_API_KEY)}`,
      password : ''
    }
  });

  if (resp?.statusText !== 'OK') {
    console.log(resp);
    throw new Error('Error verifying requestToken');
  }
}

async function updateBookStock(bookId, quantity) {
  const options = {
    headers: {
      'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
    }
  }
  try {
    const currentBook = await axios.get(
      `${process.env.DIRECTUS_API_HOST}/items/booksdata/${bookId}`
      + `?fields=stock`, options);

    const newData = {
      stock: (parseInt(currentBook.data.data.stock, 10) - parseInt(quantity, 10))
    };
    console.log({currentStock: currentBook.data.data.stock, newData, quantity})

    const resp = await axios.patch(
      `${process.env.DIRECTUS_API_HOST}/items/booksdata/${bookId}`, newData
    , options);

    if (resp.statusText !== 'OK') {
      throw new Error('Error updating book stock');
    }
  } catch (e) {
    console.log(e);
    throw new Error(`Item ${bookId} not found`);
  }
}

async function insertOrder(rawData) {
  const options = {
    headers: {
      'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }

  console.log(rawData);
  console.log(rawData.shippingAddress);

  const data = {
    "raw_data": rawData,
    "shippingaddress_fullname": rawData.shippingAddress.fullname,
    "shippingaddress_fulladdress": rawData.shippingAddress.fulladdress,
    "shippingaddress_postalcode": rawData.shippingAddress.postalcode,
    "shippingaddress_city": rawData.shippingAddress.city,
    "shippingaddress_province": rawData.shippingAddress.province,
    "shippingaddress_country": rawData.shippingAddress.country,
  }

  const resp = await axios.post(
    `${process.env.DIRECTUS_API_HOST}/items/orders_new`, JSON.stringify(data)
  , options);
  console.log('Inserting Order data');
}


exports.handler = async function (event) {
  // console.log(event);

  // 1. Grab postData from event
  try {
    console.log('After Order Hook');
    // await verifyRequestToken(event.headers['x-snipcart-requesttoken']);

    const postData = JSON.parse(event.body);
    // console.log(postData);
    await insertOrder(postData);

    for (const item of postData.content.items) {

      // console.log('>>>');
      // console.info(item);
      // console.log('<<<');

      if(item.type !== 'New') {
        await updateBookStock(item.id, item.quantity);
      }
    }

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
    console.log('ERROR');
    console.log(e);
    return {
      statusCode: 200, // Shouldn't but the Snipcart API demands it
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Error processing order. ' + e.message,
      }),
    };
  }
};