const mongoose = require("mongoose");

const conDb = (url) => {
  return mongoose.connect(url);
};


module.exports = conDb