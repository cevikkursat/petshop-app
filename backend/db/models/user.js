const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, lowercase: true },
    fName: String,
    lName: String,
    phone: String,
    email: { type: String, lowercase: true },
    password: String,
    accountStatus: { type: String, enum: ["active", "inactive", "deactivated", "banned"], default: "inactive" },
    role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
    earnedMoney: { type: Number, default: 0 },
    completedOrder: { type: Number, default: 0 },
    address: { type: [{ name: String, address: String }], default: [] },
  },
  { versionKey: false, timestamps: true }
);

const user = mongoose.model("user", userSchema);

module.exports = user;
