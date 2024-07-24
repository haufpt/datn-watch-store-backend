const orderService = require("../../../service/order/orderService");
const service = require("../../../service/order/order");
const {OrderStatusEnum} = require("../../../common/enum");

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

    const orderData = await service.getDetailOrder(orderId);
    console.log(
      `[orderController] getDetailOrder: data -> ${JSON.stringify(orderData)}`
    );

    res.render("./index.ejs", {
      title: "Chi tiết đơn hàng",
      routerName: "detail-order",
      info: req.session.account,
      orderData: orderData,
      OrderStatusEnum: OrderStatusEnum
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const putOrder = async (req, res) => {
  try {
    let orderId = req.params.orderId;
    console.log("[orderController] putOrder: id -> ", orderId);
    const {status} = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: `Dữ liệu đơn hàng không hợp lệ.`,
      });
    }

    const updateResult = await orderService.isUpdateOrder(orderId, status);
     if (!updateResult) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy đơn hàng cần cập nhật.`,
      });
    }
    res.status(201).json({
      success: true,
      message: `Cập nhật đơn hàng thành công.`,
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
  putOrder
};
