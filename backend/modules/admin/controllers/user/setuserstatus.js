const db = require("../../../../db/index.js");
const setUserStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    if (!id || !status)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });

    const user = await db.User.findById(id);
    if (!user)
      return res.json({
        status: false,
        message: "Kullanıcı Bulunamadı!",
      });

    user.accountStatus = status;
    await user.save();
    return res.json({
      status: true,
      message: "Hesap Durumu Değiştirildi! Yeni Durum: " + status,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = setUserStatus;
