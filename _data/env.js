require('dotenv').config();

module.exports = () => {
  return {
    CURRENT_YEAR: new Date().getFullYear(),
    ...process.env
  }
}