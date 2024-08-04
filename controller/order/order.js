const orderService = require("../../service/order/order");
const ShippingAddressService = require("../../service/shipping_address/shipping_address");
const DiscountService = require("../../service/discount/discount");
const mongoose = require("mongoose");
const {
  DiscountTypeEnum,
  OrderStatusEnum,
  PaymentStatusEnum,
} = require("../../common/enum");
const moment = require("moment");
let config = require("../../config/default.json");
const querystring = require("qs");
const crypto = require("crypto");

const proccessOrder = async (req, res) => {
  try {
    const order = await orderService.processOrder(req.session.account.id);

    res.status(201).json({
      success: true,
      message: `Tiến hành đơn hàng thành công.`,
      data: {
        order: order,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const checkPayment = async (req, res) => {
  try {
    const order = await orderService.findOrder({
      _id: new mongoose.Types.ObjectId(req.params.orderId),
    });
    if (!order) {
      return res.status(301).json({
        success: false,
        message: `Đơn hàng không tồn tại.`,
      });
    }

    return res.status(201).json({
      success: true,
      message: `Kiểm tra đơn hàng thành công.`,
      data: {
        isOrder: order.status !== OrderStatusEnum.PROCESSING,
      },
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

const createPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const accountId = req.session.account.id;
    const body = req.body;
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    let returnUrl =
      baseUrl +
      `api/order/vnpay-return/?accountId=${accountId}&orderId=${orderId}&shippingAddressId=${body.shippingAddressId}`;

    const existingOrder = await orderService.findOrder({
      _id: new mongoose.Types.ObjectId(orderId),
      accountId: new mongoose.Types.ObjectId(accountId),
      status: OrderStatusEnum.PROCESSING,
    });
    if (!existingOrder) {
      return res.status(301).json({
        success: false,
        message: "Đơn hàng không tồn tại.",
      });
    }

    const existingShippingAddress = await ShippingAddressService.findOne({
      _id: new mongoose.Types.ObjectId(body.shippingAddressId),
      accountId: new mongoose.Types.ObjectId(accountId),
    });
    if (!existingShippingAddress) {
      return res.status(301).json({
        success: false,
        message: "Địa chỉ giao hàng không tồn tại.",
      });
    }

    let price = existingOrder.totalAmount;

    if (body.discountId) {
      const existingDiscount = await DiscountService.findDiscount({
        _id: new mongoose.Types.ObjectId(body.discountId),
      });
      if (!existingDiscount) {
        return res.status(301).json({
          success: false,
          message: "Khuyến mãi không tồn tại.",
        });
      }

      const discountAmount =
        existingDiscount.discountType === DiscountTypeEnum.PERCENT
          ? (existingDiscount.discountValue / 100) * price
          : existingDiscount.discountValue;
      price = price - discountAmount;
      returnUrl = returnUrl + `&discountId=${body.discountId}`;
    }

    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let tradeCode = moment(date).format("DDHHmmss");

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = tradeCode;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + tradeCode;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = Math.round(price * 23000);
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    console.log("vnpUrl ", vnpUrl);
    res.status(200).json({
      success: true,
      data: {
        vnpUrl: vnpUrl,
        tradingCode: tradeCode,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Đã xảy ra lỗi ${error}`,
    });
  }
};

const vnpay_return = async (req, res) => {
  try {
    let vnp_Params = req.query;
    console.log("vnp_Params ", vnp_Params);
    const secureHash = vnp_Params["vnp_SecureHash"];
    const accountId = vnp_Params["accountId"];
    const orderId = vnp_Params["orderId"];
    const shippingAddressId = vnp_Params["shippingAddressId"];
    const discountId = vnp_Params["discountId"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    delete vnp_Params["accountId"];
    delete vnp_Params["orderId"];
    delete vnp_Params["shippingAddressId"];
    if (discountId) {
      delete vnp_Params["discountId"];
    }

    vnp_Params = sortObject(vnp_Params);

    const secretKey = config.vnp_HashSecret;

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const body = {
        shippingAddressId: shippingAddressId,
        discountId: discountId,
        paymentMethod: PaymentStatusEnum.VNPAY,
      };
      const data = {
        accountId: accountId,
        orderId: orderId,
        body: body,
      };
      await orderService.confirmOrder(data);

      return res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
    }

    return res.render("fail", { code: "97" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi",
    });
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const getListOrderByClient = async (req, res) => {
  try {
    const accountId = req.session.account.id;
    console.log(
      "[OrderController] getListOrderByClient accountId: ",
      accountId
    );
    console.log("[OrderController] getListOrderByClient query: ", req.query);

    const orders = await orderService.getListOrderByClient(
      accountId,
      req.query.status
    );

    return res.status(201).json({
      success: true,
      message: `Lấy danh sách đơn hàng thành công.`,
      data: {
        orders: orders,
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
  proccessOrder,
  confirmOrder,
  createPayment,
  vnpay_return,
  checkPayment,
  getListOrderByClient,
};
