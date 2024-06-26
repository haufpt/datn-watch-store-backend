

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

  module.exports = {
    listProduct,
  };