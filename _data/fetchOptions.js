
const dotenv = require('dotenv');
dotenv.config();

const options = {
  duration: '1h',
  type: 'json',
  fetchOptions: {
    headers: {
      'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
    }
  }
}

if (process.env.ELEVENTY_SERVERLESS) {
  options.directory = "/tmp/.cache/";
}

module.exports = options;
