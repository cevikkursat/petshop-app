const multer = require("multer");
const path = require("path");
const db = require("../db/index.js");

const storagePredict = multer.diskStorage({
  destination: "./images/predictImage",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const storageProduct = multer.diskStorage({
  destination: "./images/productImage",
  filename: (req, file, cb) => {
    cb(null, `${req.body.seller}--${req.body.productName}--${req.body.firmName}--${file.originalname}`);
  },
});
const storageAdmin = multer.diskStorage({
  destination: "./images/adminImage",
  filename: (req, file, cb) => {
    cb(null, `${req.body.date}--${file.originalname}`);
  },
});

const checkFileType = function (file, cb) {
  const fileTypes = /jpeg|jpg|png/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("HATA: Sadece Resim Yüklenebilir!!!");
  }
};

const uploadForPredict = multer({
  storage: storagePredict,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const uploadForProduct = multer({
  storage: storageProduct,
  limits: { fileSize: 2000000 },
  fileFilter: async (req, file, cb) => {
    const { productName, firmName, seller } = req.body;
    const sellerid = await db.User.findOne({ username: seller });
    const tempProduct = await db.Product.find({ productName, firmName, seller: sellerid._id.toString() });
    if (tempProduct.length > 0) return cb(new Error("Ürün daha Önce Kaydedilmiş resimleri mevcut!"));

    checkFileType(file, cb);
  },
});

const uploadForAdmin = multer({
  storage: storageAdmin,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = { uploadForPredict, uploadForProduct, uploadForAdmin };
