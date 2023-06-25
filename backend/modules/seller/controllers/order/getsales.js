const db = require("../../../../db/index.js");
const getSales = async (req, res, next) => {
  try {
    const { username, startsPoint, count, filtered, filter } = req.body;
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
      let query = {};
      query.seller = user._id;
      if (filtered) query.orderStatus = filter;
      const orders = await db.Order.find(query);
      let order = [];
      for (let i = 0; i < orders.length; i++) {
        const element = orders[i];
        const product = await db.Product.findOne({ _id: element.product });
        const user = await db.User.findOne({ _id: element.orderer }, "-password");
        order.push({ order: element, product: product, user: user });
      }
      let filteredOrders;
      if (order.length - startsPoint >= 0) {
        if (order.length - startsPoint < count) {
          filteredOrders = order.slice(startsPoint, order.length);
        } else {
          filteredOrders = order.slice(startsPoint, startsPoint + count);
        }
      } else {
        return res.json({
          status: false,
          message: "O kadar ürün bulunmuyor!",
        });
      }

      return res.json({
        status: true,
        message: "Siparişler Getirildi!",
        orders: filteredOrders,
        totalOrders: order.length,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error.toString(),
    });
  }
};

module.exports = getSales;
