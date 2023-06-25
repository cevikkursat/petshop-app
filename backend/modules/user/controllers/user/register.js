const db = require("../../../../db/index.js");
const bcrypt = require("bcryptjs");
const register = async (req, res, next) => {
  try {
    const { username, fName, lName, phone, email, password } = req.body;
    if (!username || !fName || !lName || !phone || !email || !password)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });
    const userMail = await db.User.find({ email });
    if (userMail.length > 0)
      return res.json({
        status: false,
        message: "Email daha önceden alınmış",
      });
    const userPhone = await db.User.find({ phone });
    if (userPhone.length > 0)
      return res.json({
        status: false,
        message: "Telefon daha önceden alınmış",
      });
    const userUsername = await db.User.find({ username });
    if (userUsername.length > 0)
      return res.json({
        status: false,
        message: "Username daha önceden alınmış",
      });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new db.User({
      username: username,
      fName: fName,
      lName: lName,
      phone: phone,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    return res.json({
      status: true,
      message: "Kayıt Başarılı",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = register;
