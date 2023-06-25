const db = require("../../../../db/index.js");
const getSellerInfo = async (req, res, next) => {
  try {
    const { seller } = req.body;
    if (!seller)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });
    const user = await db.User.findOne({ username: seller });
    const orders = await db.Order.find({ seller: user._id });
    const products = await db.Product.find({ seller: user._id });
    if (!orders)
      return res.json({
        status: false,
        message: "Sipariş Bulunamadı!",
      });
    let kedi = 0;
    let kopek = 0;
    let balik = 0;
    let kus = 0;
    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      if (element.isActive && element.category[0] === "kedi") {
        kedi = kedi + 1;
      } else if (element.isActive && element.category[0] === "köpek") {
        kopek = kopek + 1;
      } else if (element.isActive && element.category[0] === "balık") {
        balik = balik + 1;
      } else if (element.isActive && element.category[0] === "kus") {
        kus = kus + 1;
      }
    }
    let standing = 0;
    let shipment = 0;
    let delivered = 0;
    let cancel = 0;
    for (let index = 0; index < orders.length; index++) {
      const element = orders[index];
      if (element.orderStatus === "standing") {
        standing = standing + 1;
      } else if (element.orderStatus === "shipment") {
        shipment = shipment + 1;
      } else if (element.orderStatus === "delivered") {
        delivered = delivered + 1;
      } else {
        cancel = cancel + 1;
      }
    }
    return res.json({
      status: true,
      standing: standing,
      shipment: shipment,
      delivered: delivered,
      cancel: cancel,
      totalMoney: user.earnedMoney,
      totalOrder: standing + shipment + delivered + cancel,
      totalProducts: products.length,
      kedi: kedi,
      kopek: kopek,
      balik: balik,
      kus: kus,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = getSellerInfo;
