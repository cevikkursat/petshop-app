const db = require("../../../../db/index.js");
const setSalesStatus = async (req, res, next) => {
  try {
    const { orderID, status } = req.body;
    if (!orderID || !status)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });
    const order = await db.Order.findById(orderID);
    if (!order)
      return res.json({
        status: false,
        message: "Ürün Bulunamadı!",
      });

    order.orderStatus = status;
    await order.save();
    const seller = await db.User.findById(order.seller);
    if (!seller)
      return res.json({
        status: false,
        message: "Satıcı Bulunamadı!",
      });
    if (status === "delivered") {
      seller.earnedMoney = seller.earnedMoney + order.orderMoney * order.orderPiece;
      seller.completedOrder = seller.completedOrder + 1;
    }
    await seller.save();
    return res.json({
      status: true,
      message: "Sipariş Durumu Değiştirildi!",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = setSalesStatus;
