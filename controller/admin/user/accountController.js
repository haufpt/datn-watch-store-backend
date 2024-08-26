const { AccountRoleEnum, GetListTypeEnum } = require("../../../common/enum");
const accountService = require("../../../service/account/account");
const accountValidation = require("../../../validation/auth");

const listUser = async (req, res) => {
  try {
    const type = req.query.type;
    var searchQuery = req.query.search;

    const listAccountUser = await accountService.getAllAcountUser({
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 15,
      type: type,
      searchQuery: searchQuery,
    });
    console.log("[acountController] listAccountUser -> ", listAccountUser);
    res.render("./index.ejs", {
      title: "Danh sách khách hàng",
      routerName: "list-user",
      info: req.session.account,
      listAccountUserData: listAccountUser,
      totalPages: listAccountUser.totalPages,
      currentPage : listAccountUser.currentPage,
      limit: listAccountUser.limit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const listStaff = async (req, res) => {
  try {
    const type = req.query.type;
    var searchQuery = req.query.search;
    console.log(`[acountController] query -> ${searchQuery}`);
    
    const listAccountUser = await accountService.getAllAcountUser({
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 15,
      type: type ,
      role: AccountRoleEnum.STAFF,
      searchQuery: searchQuery,
    });
    console.log("[acountController] listStaff -> ", listAccountUser);
    res.render("./index.ejs", {
      title: "Danh sách nhân viên",
      routerName: "list-staff",
      info: req.session.account,
      listAccountUserData: listAccountUser,
      totalPages: listAccountUser.totalPages,
      currentPage : listAccountUser.currentPage,
      limit: listAccountUser.limit
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

const detailStaff = async (req, res) => {
  let idAccount = req.params.idAccount;
  const account = await accountService.findAccountById(idAccount);
  console.log("[acountController] detailStaff -> ", account);

  if (!account) {
    return res.status(301).json({
      success: false,
      message: `Account not found`,
    });
  }
  try {
    res.render("./index.ejs", {
      title: "Chi tiết nhân viên",
      routerName: "detail-staff",
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

const changeStatus = async (req, res) => {
  try {
    let idAccount = req.params.idAccount;
    let status = req.body.status;
    const account = await accountService.findAccountById(idAccount);
    console.log("[acountController] changeStatus -> ", account);

    if (!account) {
      return res.status(301).json({
        success: false,
        message: `Tài khoản không tồn tại.`,
      });
    }

    if (!status) {
      return res.status(301).json({
        success: false,
        message: "`status` field is required",
      });
    }

    await accountService.findByIdAndUpdate(idAccount, { isDeleted: status });

    res.status(201).json({
      success: true,
      message: status ? "Khoá tài khoản thành công" : `Mở tài khoản thành công`,
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
  listStaff,
  detailUser,
  detailStaff,
  changeStatus,
};
