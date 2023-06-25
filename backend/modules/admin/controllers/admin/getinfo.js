const db = require("../../../../db/index.js");
const getInfo = async (req, res, next) => {
  try {
    const users = await db.User.find({});
    const orders = await db.Order.find({});
    const products = await db.Product.find({});
    let totalUser = 0;
    let totalSeller = 0;
    let totalAdmin = 0;
    let user = 0;
    let seller = 0;
    let admin = 0;
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      if (element.role === "seller") {
        if (element.accountStatus === "active") seller = seller + 1;
        totalSeller = totalSeller + 1;
      } else if (element.role === "admin") {
        if (element.accountStatus === "active") admin = admin + 1;
        totalAdmin = totalAdmin + 1;
      } else if (element.role === "user") {
        if (element.accountStatus === "active") user = user + 1;
        totalUser = totalUser + 1;
      }
    }
    let kedi = 0;
    let kopek = 0;
    let balik = 0;
    let kus = 0;
    let totalkedi = 0;
    let totalkopek = 0;
    let totalbalik = 0;
    let totalkus = 0;
    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      if (element.category[0] === "kedi") {
        if (element.isActive) kedi = kedi + 1;
        totalkedi = totalkedi + 1;
      } else if (element.category[0] === "köpek") {
        if (element.isActive) kopek = kopek + 1;
        totalkopek = totalkopek + 1;
      } else if (element.category[0] === "balık") {
        if (element.isActive) balik = balik + 1;
        totalbalik = totalbalik + 1;
      } else if (element.category[0] === "kus") {
        if (element.isActive) kus = kus + 1;
        totalkus = totalkus + 1;
      }
    }
    let standing = 0;
    let shipment = 0;
    let delivered = 0;
    let cancel = 0;
    let totalMoney = 0;
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
      totalMoney = totalMoney + element.orderMoney * element.orderPiece;
    }
    return res.json({
      status: true,
      totalMoney: totalMoney,
      totalAccount: users.length,
      totalUser: totalUser,
      user: user,
      totalSeller: totalSeller,
      seller: seller,
      totalAdmin: totalAdmin,
      admin: admin,
      totalOrder: orders.length,
      standing: standing,
      shipment: shipment,
      delivered: delivered,
      cancel: cancel,
      totalProducts: products.length,
      kedi: kedi,
      kopek: kopek,
      balik: balik,
      kus: kus,
      totalKedi: totalkedi,
      totalKopek: totalkopek,
      totalBalik: totalbalik,
      totalKus: totalkus,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = getInfo;
