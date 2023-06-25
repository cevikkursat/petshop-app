const db = require("../../../../db/index.js");
const getUser = async (req, res, next) => {
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
    else
      return res.json({
        status: true,
        user: user,
      });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Bir hata oluştu",
    });
  }
};

module.exports = getUser;
