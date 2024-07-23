const orderService = require("../../service/order/order");

const proccessOrder = async (req, res) => {
  try {
    await orderService.processOrder(req.session.account.id);

    res.status(201).json({
      success: true,
      message: `Tiến hành đơn hàng thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const body = req.body;
    const data = {
      accountId: req.session.account.id,
      orderId: orderId,
      body: body,
    };
    await orderService.confirmOrder(data);

    res.status(201).json({
      success: true,
      message: `Đặt đơn hàng thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  proccessOrder,
  confirmOrder,
};
