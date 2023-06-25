const db = require("../../../../db/index.js");
const getListProducts = async (req, res, next) => {
  try {
    const { seller, startsPoint, count, filtered, filter, filtername } = req.body;
    if (!seller || startsPoint < 0 || count <= 0) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }
    if (filtered) {
      const sellerID = await db.User.findOne({ username: seller });
      let products;
      if (filtername === "productName") products = await db.Product.find({ seller: sellerID._id, productName: filter });
      else if (filtername === "firmName") products = await db.Product.find({ seller: sellerID._id, firmName: filter });
      else if (filtername === "category") products = await db.Product.find({ seller: sellerID._id, category: filter });
      else if (filtername === "productStatus") products = await db.Product.find({ seller: sellerID._id, productStatus: filter });
      else if (filtername === "isActive") products = await db.Product.find({ seller: sellerID._id, isActive: filter });
      let filteredProducts;
      if (products.length - startsPoint >= 0) {
        if (products.length - startsPoint < count) {
          filteredProducts = products.slice(startsPoint, products.length);
        } else {
          filteredProducts = products.slice(startsPoint, startsPoint + count);
        }
      } else {
        return res.json({
          status: false,
          message: "O kadar ürün bulunmuyor!",
        });
      }

      return res.json({
        status: true,
        products: filteredProducts,
        totalProducts: products.length,
      });
    } else {
      const sellerID = await db.User.findOne({ username: seller });
      const products = await db.Product.find({ seller: sellerID._id });
      let filteredProducts;
      if (products.length - startsPoint >= 0) {
        if (products.length - startsPoint < count) {
          filteredProducts = products.slice(startsPoint, products.length);
        } else {
          filteredProducts = products.slice(startsPoint, startsPoint + count);
        }
      } else {
        return res.json({
          status: false,
          message: "O kadar ürün bulunmuyor!",
        });
      }

      return res.json({
        status: true,
        products: filteredProducts,
        totalProducts: products.length,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: "Bir hata oluştu",
    });
  }
};

module.exports = getListProducts;
