const jwt = require("jose");
require("dotenv").config();
const db = require("../../../../db/index.js");
const buy = async (req, res, next) => {
  try {
    const { cart, addressID } = req.body;
    const token = req.body.jwt;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwt.jwtVerify(token, secret, {});
    const username = payload.data.username;

    if (!cart || !addressID)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });

    const user = await db.User.findOne({ username });
    const addres = user.address.filter((element) => element._id.toString() === addressID.toString());
    const orderCode = await db.Order.countDocuments({});

    for (item of Object.keys(cart)) {
      const product = await db.Product.findById(item);
      if (!product)
        return res.json({
          status: false,
          message: "Seçilen ürün bulunamadı!",
        });
      if (product.stock < cart[item])
        return res.json({
          status: false,
          message: `Seçilen Üründe Stok Yok! Ürün Adı: ${product.productName} Ürün Stoğu: ${product.stock}`,
        });

      const seller = await db.User.findById(product.seller);
      if (!seller)
        return res.json({
          status: false,
          message: "Seçilen satıcı bulunamadı!",
        });
      if (seller.accountStatus != "active")
        return res.json({
          status: false,
          message: "Seçilen Ürün Satıcısı Aktif Değil",
        });

      if (seller._id.toString() === user._id.toString())
        return res.json({
          status: false,
          message: `Satıcısı Olduğunuz Ürünü Alamazsınız! Satıcısı Olduğunuz Ürünü Çıkartıp Alım Yapınız! Ürün Adı: ${product.productName}`,
        });
    }

    for (item of Object.keys(cart)) {
      const product = await db.Product.findById(item);
      const seller = await db.User.findById(product.seller);
      const order = new db.Order({
        orderCode: orderCode,
        orderer: user._id,
        seller: seller._id,
        product: product._id,
        orderMoney: product.productMoney,
        orderPiece: cart[item],
        orderDate: Date.now(),
        orderAdress: addres[0].address,
      });
      await order.save();
      product.stock = product.stock - cart[item];
      if (product.stock == 0) product.productStatus = "outofstock";
      await product.save();
    }
    return res.json({
      status: true,
      message: "Sipariş Başarılı!",
      orderCode: orderCode,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error.toString(),
    });
  }
};

module.exports = buy;
