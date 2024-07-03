const listBrand = async (req, res) => {
    try {
      res.render("./index.ejs", {
        title: "Danh sach thuong hieu",
        routerName: "brand",
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
    listBrand,
  };