const db = require("../../../db/index.js");
const axios = require("axios").default;
const predict = async (req, res, next) => {
  try {
    if (req.file) {
      let dataToSend;
      let breed;
      await axios({
        method: "post",
        url: "http://127.0.0.1:8080/api/predict",
        data: {
          fileName: req.file.filename,
        },
      })
        .then(async (res) => {
          if (res.data.status === "true") {
            dataToSend = res.data.class;
            breed = await db.Dogbreed.findOne({ predictID: parseInt(dataToSend) });
          } else {
            console.log("hata" + res);
          }
        })
        .catch((err) => {
          console.log("hata" + err);
        });

      res.json({
        success: true,
        message: dataToSend,
        breed: breed,
      });
    } else {
      res.json({
        success: false,
        message: "Form Boş",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = predict;
