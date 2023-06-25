const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => console.log(err));
};

module.exports = connectDB;
