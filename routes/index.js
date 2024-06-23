const apiRouter = require("./api/api");
const websiteRouter = require("./website/website");

function route(app) {
  app.use("/api", apiRouter);

  app.use("/", websiteRouter);
}

module.exports = route;
