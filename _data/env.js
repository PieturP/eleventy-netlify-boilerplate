const dotenv = require('dotenv');

module.exports = () => {
  dotenv.config();
  return {
    IMAGE_HOST: process.env.IMAGE_HOST,
    CURRENT_YEAR: new Date().getFullYear()
  }
}