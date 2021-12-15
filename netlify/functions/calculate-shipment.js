const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const PRICE_EXPENSIVE = 65;
const WEIGHT_HEAVY = 'heavy';
const WEIGHT_EXTRA_HEAVY = 'extra-heavy';

function isEurope(country) {
  const europe = [
    'AT', // Austria
    'BE', // Belgium
    'BG', // Bulgaria
    'CY', // Cyprus
    'CZ', // Czech Republic
    'DK', // Denmark
    'FI', // Finland
    'ES', // Estonia
    'FR', // France
    'DE', // Germany
    'GR', // Greece
    'HU', // Hungary
    'IE', // Ireland
    'IT', // Italy
    'LT', // Lithuania
    'LU', // Luxembourg
    'LV', // Latvia
    'MT', // Malta
    'NL', // The Netherlands
    'PL', // Poland
    'PT', // Portugal
    'RO', // Romania
    'SK', // Slovakia
    'SI', // Slovenia
    'ES', // Spain
    'SE', // Sweden
    'GB'  // United Kingdom
  ];
  return europe.includes(country);
}

function calculateDutchShipment(nrOfItems, nrOfExpensiveItems, heavyCount, extraHeavyCount) {
  let costs;
  switch (nrOfItems){
    case 1:
      costs = 4.5;
    break;
    case 2:
      costs = 7.0;
    break;
    case 3:
    case 4:
    case 5:
      costs = 9.0;
    break;
    case 6:
    default:
      costs = 11.0;
    break;
  }
  if (nrOfExpensiveItems > 0) {
    if (nrOfExpensiveItems < 6) {
      costs = 9.0;
    } else {
      costs = 11.0;
    }
  }
  return costs;
}

function calculateEuropeanShipment(nrOfItems, nrOfExpensiveItems, heavyCount, extraHeavyCount) {
  let costs;
  switch(nrOfItems){
    case 1:
            costs = 10.0;
    break;
    case 2:
            costs = 12.0;
    break;
    case 3:
            costs = 14.0;
    break;
    case 4:
            costs = 16.0;
    break;
    case 5:
            costs = 18.0;
    break;
    case 6:
            costs = 20.0;
    break;
    case 7:
    default:
            costs = 22.0;
    break;
  }
  return costs;
}

function calculateWorldwideShipment(nrOfItems, nrOfExpensiveItems, heavyCount, extraHeavyCount) {
  let costs;
  let extraCosts;
  switch(nrOfItems){
    case 1:
            costs = 15.0;
    break;
    case 2:
            costs = 25.0;
    break;
    case 3:
            costs = 30.0;
    break;
    case 4:
            costs = 35.0;
    break;
    case 5:
            costs = 40.0;
    break;
    case 6:
            costs = 45.0;
    break;
    case 7:
    // case 8:
    // case 9:
    // case 10:
    default:
            costs = 50.0;
    break;
  }
  if (heavyCount > 0 || expensiveCount > 0) {
      extraCosts = 10.0;
  }
  if (extraHeavyCount > 0) {
      extraCosts = 15.0;
  }
  return (costs + extraCosts);
}


async function fetchBook(book) {
  console.log({book});
  const options = {
    headers: {
      'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
    }
  }
  try {
    const resp = await axios.get(
      `${process.env.DIRECTUS_API_HOST}/items/booksdata/${book.id}`
      + `?filter[stock][_gte]=1`
      + `&fields=id,price,weight,title`
    , options);
    return resp.data.data;
  } catch (e) {
    console.log(e);
    throw new Error(`Item "${book.name}" not found or out of stock`);
  }
}


exports.handler = async function (event) {
  console.log('Calculate Shipment');
  // console.log(event);

  // 1. Grab postData from event
  try {
    const postData = JSON.parse(event.body).content;

    console.log(postData);

    const country = postData.shippingAddress.country;

    let itemCount = postData.items.length;
    let expensiveItemCount = 0;
    let heavyCount = 0;
    let extraHeavyCount = 0;

    if (postData.items) {
      for(const { item } of postData.items) {
        const book = await fetchBook(item);
        heavyCount += (book.weight === WEIGHT_HEAVY) ? 1 : 0;
        extraHeavyCount += (book.weight === WEIGHT_EXTRA_HEAVY) ? 1 : 0;
        expensiveItemCount += (book.price > PRICE_EXPENSIVE) ? 1 : 0;
      }
    }


    // 7. Calculate shipment costs
    let rate = 0;
    if (country === 'NL' || country === 'DE') {
      rate = calculateDutchShipment(itemCount, expensiveItemCount, heavyCount, extraHeavyCount);
    } else if (isEurope(country)) {
      rate = calculateEuropeanShipment(itemCount, expensiveItemCount, heavyCount, extraHeavyCount);
    } else {
      rate = calculateWorldwideShipment(itemCount, expensiveItemCount, heavyCount, extraHeavyCount);
    }

    const response = {
      // country,
      // itemCount,
      // expensiveItemCount,
      // heavyCount,
      // extraHeavyCount,
      "rates": [{ "cost": rate, "description": `€ ${ rate.toFixed(2, 0) } shipping costs` }]
    }

    console.log('response: ', response);

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