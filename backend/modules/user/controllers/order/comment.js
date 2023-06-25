const db = require("../../../../db/index.js");
const comment = async (req, res, next) => {
  try {
    const { productid, username, commentTitle, commentText, rating, commentOrder } = req.body;
    if (!productid || !username || !commentTitle || !commentText || !rating) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }

    const product = await db.Product.findById(productid);
    const user = await db.User.findOne({ username: username });
    const userComments = await db.Comment.find({ user: user._id });

    if (!product || !user)
      return res.json({
        status: false,
        message: "Bir hata oluştu",
      });
    else {
      for (let index = 0; index < userComments.length; index++) {
        const element = userComments[index];
        if (element.product.toString() === productid.toString() && commentOrder.orderCode === element.commentOrderCode) {
          return res.json({
            status: false,
            message: "Daha önce bu ürün için yorum yapılmış. Tekrar yorum yapılamaz!",
          });
        }
      }
      for (let index = 0; index < commentOrder.product.length; index++) {
        const element = commentOrder.product[index];
        if (element.productID.toString() === productid.toString() && element.orderStatus !== "delivered") {
          return res.json({
            status: false,
            message: "Ürün teslim edilmeden yorum yapılamaz!",
          });
        }
      }
      const comment = new db.Comment({
        user: user._id,
        product: product._id,
        userUsername: username,
        commentTitle: commentTitle,
        commentText: commentText,
        commentDate: Date.now(),
        commentOrderDate: commentOrder.orderDate,
        commentOrderCode: commentOrder.orderCode,
        rating: rating,
      });
      await comment.save();
      const toplamRating = product.rating * product.ratingCount + rating;
      product.ratingCount = product.ratingCount + 1;
      product.rating = toplamRating / product.ratingCount;
      await product.save();
      return res.json({
        status: true,
        message: "Yorumunuz Kaydedildi!",
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

module.exports = comment;
