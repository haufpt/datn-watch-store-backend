const orderService = require("../../../service/order/orderService");

const listOrder = async (req, res, status) => {
  try {
    status = req.query.status
    console.log("[orderController] req.query -> ", req.query);
    if (!status) {
      const listOrder = await orderService.getListOrder();
      console.log(
        `[orderController] listOrder 1 -> ${JSON.stringify(listOrder)}`
      );
     return res.render("./index.ejs", {
        title: "Danh sách đơn hàng",
        routerName: "list-order",
        info: req.session.account,
        listOrderData: listOrder,
      });
    }
    const listOrder2 = await orderService.getListOrderByStatus(status);
    console.log(
      `[orderController] listOrder 2 -> ${JSON.stringify(listOrder2)}`
    );

    return res.render("./index.ejs", {
      title: "Danh sách đơn hàng",
      routerName: "list-order",
      info: req.session.account,
      listOrderData: listOrder2,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const getDetailOrder = async (req, res) => {
  try {
    let orderId = req.params.orderId;
    console.log("[orderController] getDetailOrder: id -> ", orderId);

    const orderData = await orderService.getListOrderById(orderId);
    console.log(
      `[orderController] getDetailOrder: data -> ${JSON.stringify(orderData)}`
    );

    res.render("./index.ejs", {
      title: "Chi tiết đơn hàng",
      routerName: "detail-order",
      info: req.session.account,
      orderData: orderData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  listOrder,
  getDetailOrder,
};
