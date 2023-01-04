const mongoose = require('mongoose');
require('dotenv').config();

const connection = () => {
  mongoose.connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (connection) {
    console.log('database connected');
  } else {
    console.log('database connection error');
  }
};

module.exports = { connection };
