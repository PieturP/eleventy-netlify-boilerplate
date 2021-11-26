const dotenv = require('dotenv');

module.exports = () => {
  dotenv.config();
  return {
    IMAGE_HOST: process.env.IMAGE_HOST
  }
}