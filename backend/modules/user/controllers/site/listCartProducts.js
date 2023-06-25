const db = require("../../../../db/index.js");
const getCartProducts = async (req, res, next) => {
  try {
    const { cart } = req.body;
    if (!cart) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }
    const products = await db.Product.find({ _id: cart });

    return res.json({
      status: true,
      products: products,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Bir hata oluştu",
    });
  }
};

module.exports = getCartProducts;
