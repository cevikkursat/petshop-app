const db = require("../../../../db/index.js");
const activate = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }

    const user = await db.User.findOne({ username: username }, "-password");

    if (!user)
      return res.json({
        status: false,
        message: "Bir hata oluştu",
      });
    else {
      if (user.accountStatus !== "active") {
        user.accountStatus = "active";
        await user.save();
        return res.json({
          status: true,
          message: "Hesap Aktifleştirildi!",
        });
      } else
        return res.json({
          status: false,
          message: "Hesap Zaten Aktif!",
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

module.exports = activate;
