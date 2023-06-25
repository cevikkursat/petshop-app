const db = require("../../../../db/index.js");
const jwt = require("jose");
const mailer = require("../../../../services/mailer.js");
const resetPass = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({
        status: false,
        message: "Gerekli bilgiler eksik!",
      });
    }

    const user = await db.User.findOne({ email: email }, "-password");

    if (!user)
      return res.json({
        status: false,
        message: "Girilen Maili kullanan Kullanıcı Yok",
      });
    else {
      if (user.accountStatus === "active") {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jwt.SignJWT({
          data: {
            username: user.username,
            role: user.role,
          },
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("1h")
          .sign(secret);

        const to = token.replaceAll(".", "__");
        const tokenlink = `http://localhost:5173/reset/${to}`;
        const htmlMessage = `<p>Merhaba ${user.fName},</p>
      <p>Hesap şifre sıfırlama Linkidir. Eğer Kendiniz talep etmediyseniz Dikkate Almayınız</p>
      <p>Sıfırlama linkine <a href=${tokenlink}>tıklayarak</a> sıfırlama işlemini tamamlayabilirsiniz. </p>
      <h4><b>Bu link 1 Saat Geçerlidir!</b></h4>
      <p>Link: <a href=${tokenlink}>${tokenlink}</a></p>
      <p>Bu bir otomatik mesajdır. lütfen cevaplamayınız.</p>
      <p><i>PetShop</i></p>`;
        try {
          await mailer.sendEmail({
            email: user.email,
            subject: `PetShop'a Şifre Sıfırlama!`,
            htmlMessage: htmlMessage,
          });
          return res.json({
            status: true,
            message: `Şifre sıfırlama bağlantısı ${email} mail adresine gönderildi!`,
          });
        } catch (err) {
          return res.json({
            status: false,
            message: err.toString(),
          });
        }
      } else
        return res.json({
          status: false,
          message: "Hesap aktif değil bu yüzden şifre Sıfırlanamaz!",
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

module.exports = resetPass;
