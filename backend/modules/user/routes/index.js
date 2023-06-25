const router = require("express");
const userController = require("../controllers/index.js");
const jwtValidator = require("../../../middlewares/jwtvalidator.js");
const authorization = require("../../../middlewares/authorization.js");

const userRouter = router.Router();

userRouter.route("/register").post(userController.register);
userRouter.route("/login").post(userController.login);
userRouter.route("/buy").post(jwtValidator, userController.buy);
userRouter.route("/getProducts").post(userController.getListProducts);
userRouter.route("/getCartProducts").post(userController.getCartProducts);
userRouter.route("/getProduct").post(userController.getProduct);
userRouter.route("/getuser").post(jwtValidator, userController.getUser);
userRouter.route("/changepass").post(jwtValidator, userController.changepass);
userRouter.route("/closeacc").post(jwtValidator, userController.closeacc);
userRouter.route("/getaddress").post(jwtValidator, userController.getAddress);
userRouter.route("/setaddress").post(jwtValidator, userController.setAddress);
userRouter.route("/serachproduct").post(userController.searchProducts);
userRouter.route("/getorders").post(jwtValidator, userController.getOrders);
userRouter.route("/comment").post(jwtValidator, userController.comment);
userRouter.route("/getcarousel").get(userController.getCarouselItems);
userRouter.route("/activate").post(jwtValidator, userController.activate);
userRouter.route("/resetpass").post(userController.resetpass);
userRouter.route("/resetpassword").post(jwtValidator, userController.resetpassword);

module.exports = userRouter;
