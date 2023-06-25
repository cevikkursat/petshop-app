const db = require("../../../../db/index.js");
const getUsers = async (req, res, next) => {
  try {
    const users = await db.User.find({}, "-password");

    return res.json({
      status: true,
      message: "Kullanıcılar Getirildi!",
      users: users,
      totalusers: users.length,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: error.toString(),
    });
  }
};

module.exports = getUsers;
