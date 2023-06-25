const carouselUpdate = require("./site/carouselUpdate.js");
const uploadImage = require("./site/uploadImage.js");
const getorders = require("./order/getorders.js");
const getproducts = require("./product/getproducts.js");
const getusers = require("./user/getusers.js");
const activeInactive = require("./product/activeInactive.js");
const setuserrole = require("./user/setuserrole.js");
const setuserstatus = require("./user/setuserstatus.js");
const getInfo = require("./admin/getinfo.js");

const adminController = {};

adminController.carouselUpdate = carouselUpdate;
adminController.uploadImage = uploadImage;
adminController.getorders = getorders;
adminController.getproducts = getproducts;
adminController.getusers = getusers;
adminController.activeInactive = activeInactive;
adminController.setuserrole = setuserrole;
adminController.setuserstatus = setuserstatus;
adminController.getInfo = getInfo;

module.exports = adminController;
