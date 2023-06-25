const createproduct = require("./product/createproduct");
const uploadProductImage = require("./product/uploadProductImage");
const getListProducts = require("./product/getListProducts");
const activeInactive = require("./product/activeInactive");
const discount = require("./product/discount");
const stock = require("./product/stock");
const getsales = require("./order/getsales");
const setsalesstatus = require("./order/setsalesstatus");
const getsellerinfo = require("./seller/getsellerinfo");

const sellerController = {};

sellerController.createproduct = createproduct;
sellerController.uploadProductImage = uploadProductImage;
sellerController.getListProducts = getListProducts;
sellerController.activeInactive = activeInactive;
sellerController.discount = discount;
sellerController.stock = stock;
sellerController.getsales = getsales;
sellerController.setsalesstatus = setsalesstatus;
sellerController.getsellerinfo = getsellerinfo;

module.exports = sellerController;
