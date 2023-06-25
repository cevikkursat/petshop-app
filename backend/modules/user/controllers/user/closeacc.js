const db = require("../../../../db/index.js");
const closeAcc = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }

    const user = await db.User.findOne({ username: username });

    if (!user)
      return res.json({
        status: false,
        message: "Bir hata oluştu",
      });
    else {
      const activeProduct = await db.Product.find({ seller: user._id, isActive: true });
      if (activeProduct > 0)
        return res.json({
          status: false,
          message: "Satıcı Hesabında Aktif Ürün Bulunurken Hesap Kapatılamaz.",
        });
      const activeOrder = await db.Order.find({ seller: user._id, orderStatus: { $in: ["standing", "shipment"] } });
      if (activeOrder > 0)
        return res.json({
          status: false,
          message: "Satıcı Hesabında Aktif Sipariş Bulunurken Hesap Kapatılamaz.",
        });
      const activeOrderUser = await db.Order.find({ orderer: user._id, orderStatus: { $in: ["standing", "shipment"] } });
      if (activeOrderUser > 0)
        return res.json({
          status: false,
          message: "Kullanıcının Aktif Siparişi Bulunurken Hesap Kapatılamaz.",
        });
      user.accountStatus = "deactivated";
      await user.save();
      return res.json({
        status: true,
        message: "Hesap Kapatıldı!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Bir hata oluştu",
    });
  }
};

module.exports = closeAcc;
