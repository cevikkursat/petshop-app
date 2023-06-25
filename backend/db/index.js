const User = require("./models/user.js");
const Product = require("./models/product.js");
const Comment = require("./models/comment.js");
const Order = require("./models/order.js");
const Dogbreed = require("./models/dogbreed.js");
const Carousel = require("./models/carousel.js");

const models = {};

models.User = User;
models.Product = Product;
models.Comment = Comment;
models.Order = Order;
models.Dogbreed = Dogbreed;
models.Carousel = Carousel;

module.exports = models;
