const multer = require("../../../../services/multer.js");
const createProduct = async (req, res, next) => {
  const uploadForProduct = multer.uploadForProduct.array("photos", 15);
  try {
    uploadForProduct(req, res, (err) => {
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

module.exports = createProduct;
