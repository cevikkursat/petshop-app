const jwt = require("jose");
require("dotenv").config();
const jwtValidation = async (req, res, next) => {
  try {
    const token = req.body.jwt;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwt.jwtVerify(token, secret, {});
    if (payload) {
      next();
    }
  } catch (error) {
    return res.json({
      status: false,
      message: error.toString(),
    });
  }
};

module.exports = jwtValidation;
