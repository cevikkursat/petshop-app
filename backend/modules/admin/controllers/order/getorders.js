const db = require("../../../../db/index.js");
const getOrders = async (req, res, next) => {
  try {
    let order = [];
    const orders = await db.Order.find({});
    for (let index = 0; index < orders.length; index++) {
      const element = orders[index];
      const seller = await db.User.findById(element.seller, "-password");
      const orderer = await db.User.findById(element.orderer, "-password");
      const product = await db.Product.findById(element.product);
      order.push({ seller: seller, orderer: orderer, product: product, order: element });
    }
    return res.json({
      status: true,
      message: "Ürünler Getirildi!",
      orders: order,
      totalorders: order.length,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error.toString(),
    });
  }
};

module.exports = getOrders;
