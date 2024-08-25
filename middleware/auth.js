const { accessTokenKey } = require("../common/constants");
const accountService = require("../service/account/account");
const jwtService = require("../shared/jwt");
const { handleRequest } = require("./request");

const checkLogin = handleRequest(async (req, res, next) => {
  const labelLog = "[middleware/auth.js] [checkLogin]";
  const authorization = req.headers.authorization;
  let accessToken;

  if (authorization && authorization.startsWith("Bearer")) {
    accessToken = authorization.split(" ")[1];
    console.log(`${labelLog} accessToken -> ${accessToken}`);
  }

  if (!accessToken) {
    const message = "Unauthorized";
    console.log(`${labelLog} ${message}`);
    return res.status(401).send(message);
  }

  const accessTokenDecoded = jwtService.verify(accessToken, accessTokenKey);
  console.log(
    `${labelLog} accessTokenDecoded -> ${JSON.stringify(accessTokenDecoded)}`
  );
  if (!accessTokenDecoded) {
    const message = "Unauthorized";
    console.log(`${labelLog} ${message}`);
    return res.status(401).send(message);
  }

  const foundAccount = await accountService.findAccount({
    _id: accessTokenDecoded.id,
  });
  if (!foundAccount) {
    const message = "Tài khoản không tồn tại";
    console.log(`${labelLog} ${message}`);
    return res.status(401).send(message);
  }

  req.session.account = {
    id: foundAccount._id,
    role: foundAccount.role,
    email: foundAccount.email,
  };
  console.log(
    `${labelLog} sessionAccount -> ${JSON.stringify(req.session.account)}`
  );

  return next();
});

const checkPermission = (roles) =>
  handleRequest((req, res, next) => {
    const labelLog = "[middleware/auth.js] [checkPermission]";
    const account = req.session.account;
    console.log(`${labelLog} expect role -> ${roles}`);
    console.log(`${labelLog} actual role -> ${account.role}`);

    if (!roles.includes(account.role)) {
      const message = "Forbidden";
      console.log(`${labelLog} ${message}`);
      return res.status(403).send(message);
    }

    return next();
  });

  const checkRole = (roles) => {
    return (req, res, next) => {
      if (req.session.account && roles.includes(req.session.account.role)) {
        next();
      } else {
        res.redirect("/login");
      }
    };
  };
module.exports = { checkPermission, checkLogin ,checkRole};
