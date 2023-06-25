const router = require("express");
const predictController = require("../controllers/index.js");
const multer = require("../../../services/multer.js");

const predictRouter = router.Router();

predictRouter.route("/predict").post(multer.uploadForPredict.single("image"), predictController.predict);

module.exports = predictRouter;
