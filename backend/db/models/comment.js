const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const commentSchema = new Schema(
  {
    user: { type: ObjectID, ref: "User", required: true },
    product: { type: ObjectID, ref: "Product", required: true },
    userUsername: String,
    commentTitle: String,
    commentText: String,
    commentDate: Date,
    commentOrderDate: Date,
    commentOrderCode: String,
    rating: Number,
  },
  { versionKey: false, timestamps: true }
);

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;
