const db = require("../../../../db/index.js");
const createProduct = async (req, res, next) => {
  try {
    const { carouselImage } = req.body;
    if (!carouselImage)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });
    const carousel = await db.Carousel.find();
    carousel[0].carouselItems = carouselImage;
    await carousel[0].save();
    return res.json({
      status: true,
      message: "Carousel resim kaydı başarılı",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = createProduct;
