const db = require("../../../../db/index.js");
const discount = async (req, res, next) => {
  try {
    const { productID, productDiscount, productMoney, productDiscountMoney } = req.body;
    if (!productID || productDiscount === undefined || !productMoney || !productDiscountMoney)
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

    product.productDiscount = productDiscount;
    product.productMoney = productMoney;
    product.productDiscountMoney = productDiscountMoney;
    await product.save();
    return res.json({
      status: true,
      message: productDiscount ? "Ürün İndirimi Oluşturuldu" : "Ürün İndirimi Kapatıldı",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = discount;
