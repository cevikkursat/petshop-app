const db = require("../../../../db/index.js");
const activeInactive = async (req, res, next) => {
  try {
    const { productID, isActive } = req.body;

    if (!productID || isActive === undefined)
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

    product.isActive = isActive;
    await product.save();
    return res.json({
      status: true,
      message: isActive ? "Ürün Aktif Edildi" : "Ürün İnaktif Edildi",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = activeInactive;
