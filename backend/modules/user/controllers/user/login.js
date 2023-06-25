const db = require("../../../../db/index.js");
require("dotenv").config();
const jwt = require("jose");
const bcrypt = require("bcryptjs");
const mailer = require("../../../../services/mailer.js");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.json({
        status: false,
        message: "Eksik veya Hatalı Bilgi",
      });
    const user = await db.User.find({ username: username });
    if (user.length <= 0)
      return res.json({
        status: false,
        message: "Kullanıcı Bulunamadı!",
      });
    if (!(await bcrypt.compare(password, user[0].password)))
      return res.json({
        status: false,
        message: "Şifre Yanlış!",
      });
    if (user[0].accountStatus !== "active" && user[0].accountStatus !== "inactive")
      return res.json({
        status: false,
        message: "Kullanıcı Aktif Değil! " + user[0].accountStatus,
      });
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jwt.SignJWT({
      data: {
        username: user[0].username,
        role: user[0].role,
      },
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const to = token.replaceAll(".", "__");
    const tokenlink = `http://localhost:5173/auth/${to}`;
    if (user[0].accountStatus === "inactive") {
      const htmlMessage = `<p>Merhaba ${user[0].fName},</p>
      <p>Hesaba ilk girişte giriş yapmak için mail onayıdır.</p>
      <p>Onaylama linkine <a href=${tokenlink}>tıklayarak</a> onaylama işlemini tamamlayabilirsiniz. </p>
      <h4><b>Bu link 1 Saat Geçerlidir!</b></h4>
      <p>Link: <a href=${tokenlink}>${tokenlink}</a></p>
      <p>Bu bir otomatik mesajdır. lütfen cevaplamayınız.</p>
      <p><i>PetShop</i></p>`;
      try {
        await mailer.sendEmail({
          email: user[0].email,
          subject: `PetShop'a Hoş Geldiniz!`,
          htmlMessage: htmlMessage,
        });
        return res.json({
          status: false,
          message: "Giriş yapmak için mail adresinize gönderilen link ile hesabı doğrulayın!",
        });
      } catch (err) {
        return res.json({
          status: false,
          message: err.toString(),
        });
      }
    }
    return res.json({
      status: true,
      message: "Giriş Başarılı!",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = login;
