const db = require("../../../../db/index.js");
const bcrypt = require("bcryptjs");
const resetPassword = async (req, res, next) => {
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
      if (user.accountStatus === "active") {
        let sifre = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < 10) {
          sifre += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        const hashedPassword = await bcrypt.hash(sifre, 10);
        user.password = hashedPassword;
        await user.save();
        return res.json({
          status: true,
          message: "Hesap Şifresi Sıfırlandı! Şifre: " + sifre,
        });
      } else
        return res.json({
          status: false,
          message: "Hesap aktif değil! Aktif olmayan kullanıcılar şifre sıfırlayamaz.",
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

module.exports = resetPassword;
