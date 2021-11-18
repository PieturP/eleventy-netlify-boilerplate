
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

function calculateDutchShipment(nrOfItems, nrOfExpensiveItems) {
  let costs;
  switch (nrOfItems){
    case 1:
      costs = 4.0;
    break;
    case 2:
      costs = 6.0;
    break;
    case 3:
    case 4:
    case 5:
      costs = 8.0;
    break;
    case 6:
    default:
      costs = 10.0;
    break;
  }
  if (nrOfExpensiveItems > 0) {
    if (nrOfExpensiveItems < 6) {
      costs = 8.0;
    } else {
      costs = 10.0;
    }
  }
  return costs;
}



exports.handler = async function (event) {
  console.log('Calculate Shipment');
  console.log(event);
  let postData = null;

  // 1. Grab postData from event
  try {
    postData = JSON.parse(event.body).content;


    // 2. Get bookData from postData
    console.log({postData});

    console.log({items: postData.items});
    if (postData.items) {
      for(const item of postData.items) {
        console.log({item, customFields: item.customFields});
      }
    }

    // 3. Get shipmentData from postData
    const country = postData.shippingAddress.country;
    console.log({country});

    let itemCount = postData.items.length;
    let expensiveItemCount = 0;

    // 5. Fetch book(s) mentioned in bookData

    // 6. Get book weight from fetched books

    // 7. Calculate shipment costs
    let rate = 0;
    if (country === 'NL' || country === 'DE') {
      rate = calculateDutchShipment(itemCount, expensiveItemCount);
    } else if (isEurope(country)) {
      rate = calculateDutchShipment(itemCount, expensiveItemCount);
    } else {
      rate = calculateDutchShipment(itemCount, expensiveItemCount);
    }

    const response = {
      "rates": [{ "cost": rate, "description": `€ ${rate}.00 shipping costs` }]
    }

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
        message: 'No postData found in event',
      }),
    };
  }
};