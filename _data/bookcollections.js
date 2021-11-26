const dotenv = require('dotenv');
const axios = require('axios');

module.exports = async () => {

  dotenv.config();

  const options = {
    headers: {
      'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
    }
  }
  const resp = await axios.get(
    `${process.env.DIRECTUS_API_HOST}/items/collection` +
    `?fields=*,books.book_id.*,books.book_id.images.image_id.*`
  , options);

  return resp.data.data
};