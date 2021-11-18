exports.handler = (event) => {
  console.log(event);

  // 1. Grab postData from event
  if (!event.body) {
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
  const postData = JSON.parse(event.body).content;

  // 2. Get bookData from postData

  console.log('------ postData ------');
  console.log(postData);

  // 3. Get shipmentData from postData

  // 5. Fetch book(s) mentioned in bookData

  // 6. Get book weight from fetched books

  // 7. Calculate shipment costs




  const response = {
    "rates": [{
      "cost": 12,
      "description": "12$ shipping"
      }
    ]
  }
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( response )
  }
};