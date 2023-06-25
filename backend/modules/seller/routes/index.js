const router = require("express");
const sellerController = require("../controllers/index.js");
const jwtValidator = require("../../../middlewares/jwtvalidator.js");
const authorization = require("../../../middlewares/authorization.js");

const sellerRouter = router.Router();

sellerRouter.route("/createproduct").post(jwtValidator, authorization("seller"), sellerController.createproduct);
sellerRouter.route("/uploadimage").post(sellerController.uploadProductImage);
sellerRouter.route("/getlistproducts").post(jwtValidator, authorization("seller"), sellerController.getListProducts);
sellerRouter.route("/activeInactive").post(jwtValidator, authorization("seller"), sellerController.activeInactive);
sellerRouter.route("/discount").post(jwtValidator, authorization("seller"), sellerController.discount);
sellerRouter.route("/stock").post(jwtValidator, authorization("seller"), sellerController.stock);
sellerRouter.route("/getsales").post(jwtValidator, authorization("seller"), sellerController.getsales);
sellerRouter.route("/setsalesstatus").post(jwtValidator, authorization("seller"), sellerController.setsalesstatus);
sellerRouter.route("/getsellerinfo").post(jwtValidator, authorization("seller"), sellerController.getsellerinfo);

module.exports = sellerRouter;
