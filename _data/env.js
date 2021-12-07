const dotenv = require('dotenv');

module.exports = () => {
  dotenv.config();
  return {
    ROOT_DOMAIN: process.env.ROOT_DOMAIN,
    IMAGE_HOST: process.env.IMAGE_HOST,
    CURRENT_YEAR: new Date().getFullYear(),
  }
}