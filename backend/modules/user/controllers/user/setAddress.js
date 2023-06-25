const db = require("../../../../db/index.js");
const setAddress = async (req, res, next) => {
  try {
    const { username, address } = req.body;
    if (!username || !address) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }

    const user = await db.User.findOne({ username: username });
    if (!user)
      return res.json({
        status: false,
        message: "Bir hata oluştu",
      });
    else {
      user.address = address;
      await user.save();
      return res.json({
        status: true,
        message: "Adresler kaydedildi!",
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

module.exports = setAddress;
