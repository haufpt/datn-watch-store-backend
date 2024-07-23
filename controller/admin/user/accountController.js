const accountService = require("../../../service/account/account");
const accountValidation = require("../../../validation/auth");

const listUser = async (req, res) => {
    try {
      const listAccountUser = await accountService.getAllAcountUser();
      console.log("[acountController] listAccountUser -> ", listAccountUser);
      res.render("./index.ejs", {
        title: "Danh sách khách hàng",
        routerName: "list-user",
        info: req.session.account,
        listAccountUserData: listAccountUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `${error.message}`,
      });
    }
  };

  const detailUser = async (req, res) => {
    let idAccount = req.params.idAccount;
    const account = await accountService.findAccountById(idAccount);
    console.log("[acountController] detailAccount -> ", account);

    if (!account) {
      return res.status(301).json({
        success: false,
        message: `Account not found`,
      });
    }
    try {
      res.render("./index.ejs", {
        title: "Chi tiết khách hàng",
        routerName: "detail-user",
        info: req.session.account,
        detailUserData: account,
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
  