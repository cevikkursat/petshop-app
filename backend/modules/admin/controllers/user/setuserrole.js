const db = require("../../../../db/index.js");
const setUserRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;

    if (!id || !role)
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

    user.role = role;
    await user.save();
    return res.json({
      status: true,
      message: "Hesap Rolü Değiştirildi! Yeni Rol: " + role,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = setUserRole;
