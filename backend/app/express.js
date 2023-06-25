const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const predictRouter = require("../modules/predict/routes/index.js");
const userRouter = require("../modules/user/routes/index.js");
const sellerRouter = require("../modules/seller/routes/index.js");
const adminRouter = require("../modules/admin/routes/index.js");

const runApp = () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

  app.use("/images", express.static("./images"));

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Api düzgün çalışıyor!",
    });
  });
  app.use("/api/predict", predictRouter);
  app.use("/api/user", userRouter);
  app.use("/api/seller", sellerRouter);
  app.use("/api/admin", adminRouter);
  return app;
};

module.exports = runApp;
