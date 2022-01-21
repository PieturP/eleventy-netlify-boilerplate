const axios = require('axios');
require('dotenv').config();
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

  console.log('RAW DATA:');
  console.log(rawData);
  const content = rawData.content;

  console.log('CONTENT:');
  console.log(content);

  const data = {
    "raw_data": rawData,
    "shippingaddress_firstname": content.shippingAddress.firstName,
    "shippingaddress_name": content.shippingAddress.name.trim(),
    "shippingaddress_fullname": content.shippingAddress.fullName.trim(),
    "shippingaddress_address1": content.shippingAddress.address1.trim(),
    "shippingaddress_address2": content.shippingAddress.address2.trim(),
    "shippingaddress_fulladdress": content.shippingAddress.fullAddress.trim(),
    "shippingaddress_postalcode": content.shippingAddress.postalCode.trim(),
    "shippingaddress_city": content.shippingAddress.city.trim(),
    "shippingaddress_province": content.shippingAddress.province.trim(),
    "shippingaddress_country": content.shippingAddress.country.trim(),
    "email": content.email.trim(),
    "invoice_uid": content.token,
    "invoice_number": content.invoiceNumber,
    "date_created": content.creationDate,
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