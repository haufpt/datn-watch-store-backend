const mongoose = require("mongoose");
const productService = require("../../../service/product/product");
const accountService = require("../../../service/account/account");
const orderService = require("../../../service/order/order");
const { TopProductTypeEnum, AccountRoleEnum } = require("../../../common/enum");

const statisticalStore = async (req, res) => {
  try {
    const listTopProduct = await productService.getListProduct({
      type: TopProductTypeEnum.SALE,
      limit: 10,
    });
    let filteredProducts = listTopProduct.filter(
      (product) => product.totalSold > 0
    );
    filteredProducts.sort((a, b) => b.totalSold - a.totalSold);

    let products = await productService.getListProduct();

    const clients = await accountService.getAllAcountUser();

    const staffs = await accountService.getAllAcountUser({
      role: AccountRoleEnum.STAFF,
    });

    const revenue = await orderService.calculateRevenue(new Date(), new Date());

    const productSold = await orderService.calculateTotalSoldProducts(
      new Date(),
      new Date()
    );

    res.render("./index.ejs", {
      title: "Thống kê",
      routerName: "statistical",
      info: req.session.account,
      listTopProduct: filteredProducts,
      activity: {
        quantityStaff: staffs.accounts.length,
        quantityClient: clients.accounts.length,
        quantityProduct: products.length,
      },
      totalSold: productSold,
      revenue: revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const getStatistical = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log("[statisticalController] getStatistical query: ", req.query);

    const revenue = await orderService.calculateRevenue(startDate, endDate);

    const productSold = await orderService.calculateTotalSoldProducts(
      startDate,
      endDate
    );

    res.status(201).json({
      success: true,
      message: "Lấy doanh thu thành công",
      data: {
        revenue: revenue,
        totalSold: productSold,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  statisticalStore,
  getStatistical,
};
