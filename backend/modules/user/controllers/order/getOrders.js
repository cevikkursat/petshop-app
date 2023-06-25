const db = require("../../../../db/index.js");
const getOrders = async (req, res, next) => {
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
      const orders = await db.Order.find({ orderer: user._id });
      let order = {};
      for (let i = 0; i < orders.length; i++) {
        const element = orders[i];
        const product = await db.Product.findOne({ _id: element.product });
        if (order[element.orderCode]) {
          order[element.orderCode] = {
            orderCode: element.orderCode,
            totalPiece: element.orderPiece + order[element.orderCode].totalPiece,
            totalMoney: element.orderMoney * element.orderPiece + order[element.orderCode].totalMoney,
            orderDate: element.orderDate,
            orderAdress: element.orderAdress,
            product: [
              ...order[element.orderCode].product,
              {
                orderMoney: element.orderMoney,
                orderPiece: element.orderPiece,
                orderStatus: element.orderStatus,
                productID: product._id,
                productName: product.productName,
                productImage: product.productImage,
                firmName: product.firmName,
              },
            ],
          };
        } else {
          order[element.orderCode] = {
            orderCode: element.orderCode,
            totalPiece: element.orderPiece,
            totalMoney: element.orderMoney * element.orderPiece,
            orderDate: element.orderDate,
            orderAdress: element.orderAdress,
            product: [
              {
                orderMoney: element.orderMoney,
                orderPiece: element.orderPiece,
                orderStatus: element.orderStatus,
                productID: product._id,
                productName: product.productName,
                productImage: product.productImage,
                firmName: product.firmName,
              },
            ],
          };
        }
      }
      let o = [];
      for (let index = 0; index < Object.keys(order).length; index++) {
        const element = Object.keys(order)[index];
        o.push(order[element]);
      }

      return res.json({
        status: true,
        message: "Siparişler Getirildi!",
        orders: o,
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

module.exports = getOrders;
