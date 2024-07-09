

const listProduct = async (req, res) => {
    try {
      res.render("./index.ejs", {
        title: "Danh sach san pham",
        routerName: "product",
        info: req.session.account,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `${error.message}`,
      });
    }
  };

  const addProduct = async (req, res) => {
    try {
      res.render("./index.ejs", {
        title: "Them moi san pham",
        routerName: "addProduct",
        info: req.session.account,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `${error.message}`,
      });
    }
  };

  const detailProduct = async (req, res) => {
    try {
      res.render("./index.ejs", {
        title: "Chi tiet san pham",
        routerName: "detailProduct",
        info: req.session.account,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `${error.message}`,
      });
    }
  };

  module.exports = {
    listProduct,
    addProduct,
    detailProduct
  };