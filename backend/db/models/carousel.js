const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carouselSchema = new Schema(
  {
    carouselItems: [],
  },
  { versionKey: false }
);
const carousel = mongoose.model("carousel", carouselSchema);

module.exports = carousel;
