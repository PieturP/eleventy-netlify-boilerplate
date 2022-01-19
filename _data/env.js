const dotenv = require('dotenv');

module.exports = () => {
  dotenv.config();
  return {
    CURRENT_YEAR: new Date().getFullYear(),
    ...process.env
  }
}