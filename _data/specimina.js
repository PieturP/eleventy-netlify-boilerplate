const dotenv = require('dotenv');
const Cache = require("@11ty/eleventy-cache-assets");
const options = require('./fetchOptions');

module.exports = async () => {

  dotenv.config();

  // const options = {
  //   headers: {
  //     'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`
  //   }
  // }
  // const resp = await axios.get(
  //   `${process.env.DIRECTUS_API_HOST}/specimina`
  // , options);

  const resp = await Cache(`${process.env.DIRECTUS_API_HOST}/specimina`, options);

  return resp.specimina.sort().reverse();

};
