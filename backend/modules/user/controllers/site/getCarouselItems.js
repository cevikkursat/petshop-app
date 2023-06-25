const db = require("../../../../db/index.js");
const getCarouselItems = async (req, res, next) => {
  try {
    const carouselItems = await db.Carousel.find();

    if (!carouselItems)
      return res.json({
        status: false,
        message: "Bir hata oluştu",
      });
    else {
      return res.json({
        status: true,
        carouselItems: carouselItems[0].carouselItems,
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

module.exports = getCarouselItems;
