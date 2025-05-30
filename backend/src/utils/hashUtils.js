 
// backend/src/utils/hashUtils.js
const bcrypt = require('bcrypt');

const saltRounds = 10; // Número de rondas de sal para bcrypt

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };