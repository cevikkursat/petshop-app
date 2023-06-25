const db = require("../../../../db/index.js");
const createProduct = async (req, res, next) => {
  try {
    const { seller, productName, productImage, productDesc, productMoney, firmName, category, stock } = req.body;
    if (!seller)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });
    const sellerid = await db.User.findOne({ username: seller });
    if (!sellerid || !productName || !productImage || !productDesc || !productMoney || !firmName || !category || !stock)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });
    const tempProduct = await db.Product.find({ productName, firmName, seller: sellerid._id.toString() });
    if (tempProduct.length > 0)
      return res.json({
        status: false,
        message: "Aynı ürün aynı satıcı tarafından daha önce oluşturulmuş!",
        product: tempProduct[0]._id,
      });
    const product = new db.Product({
      seller: sellerid._id,
      productName: productName,
      productImage: productImage,
      productDesc: productDesc,
      productMoney: productMoney,
      firmName: firmName,
      category: category,
      stock: stock,
    });
    await product.save();
    return res.json({
      status: true,
      message: "Ürün kaydı başarılı",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = createProduct;
