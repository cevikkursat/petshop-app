const db = require("../../../../db/index.js");
const stock = async (req, res, next) => {
  try {
    const { productID, stock } = req.body;
    if (!productID || !stock)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });
    const product = await db.Product.findById(productID);
    if (!product)
      return res.json({
        status: false,
        message: "Ürün Bulunamadı!",
      });

    product.stock = stock;
    if (stock == 0) product.productStatus = "outofstock";
    else product.productStatus = "instock";
    await product.save();
    return res.json({
      status: true,
      message: "Ürün Stoğu Kaydedildi",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = stock;
