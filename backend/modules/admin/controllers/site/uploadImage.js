const multer = require("../../../../services/multer.js");
const uploadCarousel = async (req, res, next) => {
  const uploadForAdmin = multer.uploadForAdmin.array("photos", 10);
  try {
    uploadForAdmin(req, res, (err) => {
      if (err) {
        console.log(err);
        return res.json({
          status: false,
          message: err.toString(),
        });
      }
      return res.json({
        status: true,
        message: "Resim Kaydı Başarılı",
      });
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = uploadCarousel;
