const jwt = require("jsonwebtoken");
const secret = "pharmatic";
const createToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  return token;
};
const verifyToken = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};
module.exports = {
  createToken,
  verifyToken,
};
