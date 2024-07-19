const listUser = async (req, res) => {
    try {
      res.render("./index.ejs", {
        title: "Danh sach khach hang",
        routerName: "list-user",
        info: req.session.account,
        listUserData: listUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `${error.message}`,
      });
    }
  };

  const detailUser = async (req, res) => {
    try {
      res.render("./index.ejs", {
        title: "Chi tiet khach hang",
        routerName: "detail-user",
        info: req.session.account,
        detailUserData: detailUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `${error.message}`,
      });
    }
  };
  
  module.exports = {
    listUser,
    detailUser
  };
  