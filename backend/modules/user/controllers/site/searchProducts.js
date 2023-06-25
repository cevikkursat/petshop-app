const db = require("../../../../db/index.js");
const searchProducts = async (req, res, next) => {
  try {
    const { mainFilter, startsPoint, count } = req.body;
    if (!mainFilter || startsPoint < 0 || count <= 0) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }
    const filter = mainFilter.replace("_", " ");
    let query = {
      $and: [
        {
          $or: [
            { category: filter },
            { productName: { $regex: filter, $options: "i" } },
            { productDesc: { $regex: filter, $options: "i" } },
            { firmName: { $regex: filter, $options: "i" } },
          ],
        },
        { isActive: true },
      ],
    };
    const products = await db.Product.find(query);
    let filteredProducts;

    if (products.length - startsPoint >= 0) {
      if (products.length - startsPoint < count) {
        filteredProducts = products.slice(startsPoint, products.length);
      } else {
        filteredProducts = products.slice(startsPoint, startsPoint + count);
      }
    } else {
      return res.json({
        status: false,
        message: "Ürün bulunmuyor!",
      });
    }

    return res.json({
      status: true,
      products: filteredProducts,
      totalProducts: products.length,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Bir hata oluştu",
    });
  }
};

module.exports = searchProducts;
