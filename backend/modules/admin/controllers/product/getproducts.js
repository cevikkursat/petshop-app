const db = require("../../../../db/index.js");
const getProducts = async (req, res, next) => {
  try {
    let product = [];
    const products = await db.Product.find({});
    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      const seller = await db.User.findById(element.seller, "-password");
      product.push({ seller: seller, product: element });
    }
    return res.json({
      status: true,
      message: "Ürünler Getirildi!",
      products: product,
      totalproducts: product.length,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error.toString(),
    });
  }
};

module.exports = getProducts;
