const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  if (!options.email || options.email === "") {
    return false;
  }
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  try {
    await transporter.sendMail(
      {
        from: "PetShop",
        to: options.email,
        subject: options.subject,
        html: options.htmlMessage,
      },
      (error, info) => {
        if (error) {
          console.log("bir hata var: " + error);
          return false;
        }
        transporter.close();
        return true;
      }
    );
  } catch (error) {
    console.log("bir hata var: " + error);
  }
};

module.exports = { sendEmail };
