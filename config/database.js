const mongoose = require("mongoose");

const DB =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_DATABASE
    : `${process.env.DATABASE}`;
const dbConnection = () => {
  mongoose.connect(DB).then(() => {
    console.log(`DB Connected in ${process.env.NODE_ENV} Env Successful!`);
  });
};

module.exports = dbConnection;
