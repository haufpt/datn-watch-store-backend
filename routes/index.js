const authRouter = require("./auth/auth");
const brandRouter = require("./brand/brand");
const productRouter = require("./product/product");

function route(app) {
  app.use("/auth", authRouter);

  app.use("/brand", brandRouter);

  app.use("/product", productRouter);
}

module.exports = route;
