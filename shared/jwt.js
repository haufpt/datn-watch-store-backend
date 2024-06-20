const jwt = require("jsonwebtoken");
const {
  accessTokenKey,
  accessTokenExpires,
  refreshTokenKey,
  refreshTokenExpires,
} = require("../common/constants");

const sign = (payload, secretKey, expires) => {
  const labelLog = "[shared/jwt.js] [sign]";
  console.log(`${labelLog} payload -> ${JSON.stringify(payload)}`);

  try {
    return jwt.sign(payload, secretKey, { expiresIn: expires });
  } catch (error) {
    console.log(`${labelLog} error -> ${error.message}`);
    return;
  }
};

const verify = (token, secretKey) => {
  const labelLog = "[shared/jwt.js] [verify]";
  console.log(`${labelLog} token -> ${token}`);

  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log(`${labelLog} error -> ${error.message}`);
    return;
  }
};

const generateToken = (payload) => {
  const accessToken = sign(payload, accessTokenKey, accessTokenExpires);
  const refreshToken = sign(payload, refreshTokenKey, refreshTokenExpires);

  return {
    access: accessToken,
    refresh: refreshToken,
  };
};

module.exports = {
  sign,
  verify,
  generateToken,
};
