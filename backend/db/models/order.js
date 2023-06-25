const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const orderSchema = new Schema(
  {
    orderCode: String,
    orderer: { type: ObjectID, ref: "User", required: true },
    seller: { type: ObjectID, ref: "User", required: true },
    product: { type: ObjectID, ref: "Product", required: true },
    orderMoney: Number,
    orderPiece: Number,
    orderDate: Date,
    orderAdress: String,
    orderStatus: { type: String, enum: ["standing", "shipment", "delivered", "cancel", "return"], default: "standing" },
  },
  { versionKey: false, timestamps: true }
);

const order = mongoose.model("order", orderSchema);

module.exports = order;
