const jwt = require("jsonwebtoken");
const { getUser } = require("../services/auth.service");
const SECRET_KEY = "ffc";

const authenticate = async(req, res, next) => {
  try {
    const { token } = req.headers;
    const user = jwt.verify(token, SECRET_KEY);
    if (!user) {
      return res.status(401).send("Invalid Token");
    }
    const emp = await getUser(user.id);
    req.user = emp;
    next();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = authenticate;
