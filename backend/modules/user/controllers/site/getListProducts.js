const db = require("../../../../db/index.js");
const getListProducts = async (req, res, next) => {
  try {
    const { tur, startsPoint, count, filtered, selectedfirmName, selectedcategories, selectedRating, selectedPrice } = req.body;
    if (!tur || startsPoint < 0 || count <= 0) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }

    const firms = await db.Product.distinct("firmName", { category: tur, isActive: true });
    const cate = await db.Product.distinct("category", { category: tur, isActive: true });
    let query = {};
    query.isActive = true;
    if (tur && !selectedcategories) {
      query.category = { $in: [tur] };
    }
    if (selectedcategories && selectedcategories.length > 0) {
      query.$and = [{ category: { $in: [tur] } }, { category: { $in: [...selectedcategories] } }];
    }
    if (selectedfirmName && selectedfirmName.length > 0) {
      query.firmName = { $in: [...selectedfirmName] };
    }
    if (selectedRating && selectedRating !== "hepsi") {
      query.rating = { $gte: selectedRating };
    }
    if (selectedPrice && selectedPrice.length > 0) {
      query.productMoney = { $in: [selectedPrice[0], selectedPrice[1]] };
    }

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
    if (products.length > 0)
      return res.json({
        status: true,
        firms: firms,
        cate: cate,
        products: filteredProducts,
        filtered: filtered,
        totalProducts: products.length,
      });
    else
      return res.json({
        status: true,
        firms: [],
        cate: [],
        products: filteredProducts,
        filtered: filtered,
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

module.exports = getListProducts;
