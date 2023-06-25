const db = require("../../../../db/index.js");
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }

    const product = await db.Product.findOne({ _id: id, isActive: true });
    if (!product)
      return res.json({
        status: false,
        message: "Ürün bulunamadı lütfen daha sonra tekrar deneyiniz!",
      });
    const seller = await db.User.findById(product.seller);
    const productComments = await db.Comment.find({ product: product._id });

    if (!seller)
      return res.json({
        status: false,
        message: "Satıcı bulunamadı lütfen daha sonra tekrar deneyiniz!",
      });
    else
      return res.json({
        status: true,
        product: product,
        productComments: productComments,
        seller: seller.username,
      });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Bir hata oluştu",
    });
  }
};

module.exports = getProduct;
