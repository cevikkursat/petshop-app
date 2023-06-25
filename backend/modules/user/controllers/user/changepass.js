const db = require("../../../../db/index.js");
const bcrypt = require("bcryptjs");
const getUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
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
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      return res.json({
        status: true,
        message: "Şifre Değiştirildi",
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

module.exports = getUser;
