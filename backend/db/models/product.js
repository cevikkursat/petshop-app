const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = mongoose.Types.ObjectId;

const productSchema = new Schema(
  {
    seller: { type: ObjectID, ref: "User", required: true },
    productName: String,
    productImage: { type: [] },
    productDesc: String,
    productMoney: String,
    productDiscountMoney: { type: String, default: "0" },
    productDiscount: { type: Boolean, default: false },
    firmName: String,
    category: { type: [] },
    stock: String,
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    productStatus: { type: String, enum: ["instock", "outofstock"], default: "instock" },
    isActive: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

const product = mongoose.model("product", productSchema);

module.exports = product;
