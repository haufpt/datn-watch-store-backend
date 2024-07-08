const apiRouter = require("./api/api");
const websiteRouter = require("./website/website");
const loginRouter = require("../controller/auth/auth");

function route(app) {
  app.use("/api", apiRouter);

  app.use("/", websiteRouter);

  app.use("/", loginRouter.redirectLogin);
}

module.exports = route;
