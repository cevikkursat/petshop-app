const router = require("express");
const adminController = require("../controllers/index.js");
const jwtValidator = require("../../../middlewares/jwtvalidator.js");
const authorization = require("../../../middlewares/authorization.js");

const adminRouter = router.Router();

adminRouter.route("/carouselupdate").post(jwtValidator, authorization("admin"), adminController.carouselUpdate);
adminRouter.route("/uploadimage").post(adminController.uploadImage);
adminRouter.route("/getorders").post(jwtValidator, authorization("admin"), adminController.getorders);
adminRouter.route("/getproducts").post(jwtValidator, authorization("admin"), adminController.getproducts);
adminRouter.route("/getusers").post(jwtValidator, authorization("admin"), adminController.getusers);
adminRouter.route("/activeInactive").post(jwtValidator, authorization("admin"), adminController.activeInactive);
adminRouter.route("/setuserrole").post(jwtValidator, authorization("admin"), adminController.setuserrole);
adminRouter.route("/setuserstatus").post(jwtValidator, authorization("admin"), adminController.setuserstatus);
adminRouter.route("/getinfo").post(jwtValidator, authorization("admin"), adminController.getInfo);

module.exports = adminRouter;
