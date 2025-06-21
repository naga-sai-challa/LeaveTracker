const jwt = require("jsonwebtoken");
const SECRET_KEY = "ffc";

const authenticate = (req, res, next) => {
  try {
    const { token } = req.headers;
    const user = jwt.verify(token, SECRET_KEY);
    if (!user) {
      return res.status(401).send("Invalid Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = authenticate;
