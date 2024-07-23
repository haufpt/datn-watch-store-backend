const { OrderStatusEnum } = require("../../common/enum");
const orderModel = require("../../model/order");
const orderItemModel = require("../../model/order_item");
const AccountService = require("../../service/account/account");
const DiscountService = require("../../service/discount/discount");
const ShippingAddressService = require("../../service/shipping_address/shipping_address");
const CartService = require("../../service/cart/cart");
const mongoose = require("mongoose");
const Helper = require("../../utils/helper");

const processOrder = async (accountId) => {
  console.log("[OrderService] processOrder: ", accountId);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingAccount = await AccountService.findAccount({
      _id: new mongoose.Types.ObjectId(accountId),
    });
    if (!existingAccount) {
      throw new Error("Tài khoản không tồn tại.");
    }

    const listCart = await CartService.getListCart(accountId);
    if (!listCart || listCart.length === 0) {
      throw new Error("Chưa có sản phẩm trong giỏ hàng.");
    }

    const totalAmount = listCart.reduce((previousValue, item) => {
      return previousValue + item.product.price * item.quantity;
    }, 0.0);

    const currentDate = new Date();
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + 4);

    const newOrder = {
      code: Helper.generateRandomCode(),
      accountId: new mongoose.Types.ObjectId(accountId),
      totalAmount: totalAmount,
      orderDate: currentDate,
      estDeliveryDate: deliveryDate,
      status: OrderStatusEnum.PROCESSING,
    };
    const order = new orderModel(newOrder);

    const resultOrder = await order.save({ session });
    console.log("[OrderService] processOrder resultOrder: ", resultOrder);

    const listOrderItem = listCart.map((cart) => {
      return {
        orderId: resultOrder._id,
        productId: cart.product._id,
        quantity: cart.quantity,
      };
    });
    console.log("[OrderService] processOrder listOrderItem: ", listOrderItem);

    const resultOrderItems = await orderItemModel.insertMany(listOrderItem, {
      session,
    });
    console.log(
      "[OrderService] processOrder resultOrderItems: ",
      resultOrderItems
    );
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const confirmOrder = async (data) => {
  const { accountId, orderId, body } = data;
  console.log("[OrderService] confirmOrder data: ", data);

  const existingAccount = await AccountService.findAccount({
    _id: new mongoose.Types.ObjectId(accountId),
  });
  if (!existingAccount) {
    throw new Error("Tài khoản không tồn tại.");
  }

  const existingOrder = await findOrder({
    _id: new mongoose.Types.ObjectId(orderId),
    accountId: new mongoose.Types.ObjectId(accountId),
    status: OrderStatusEnum.PROCESSING,
  });
  if (!existingOrder) {
    throw new Error("Đơn hàng không tồn tại.");
  }

  const existingShippingAddress = await ShippingAddressService.findOne({
    _id: new mongoose.Types.ObjectId(body.shippingAddressId),
    accountId: new mongoose.Types.ObjectId(accountId),
  });
  if (!existingShippingAddress) {
    throw new Error("Địa chỉ giao hàng không tồn tại.");
  }

  if (body.discountId) {
    const existingDiscount = await DiscountService.findDiscount({
      _id: new mongoose.Types.ObjectId(body.discountId),
    });
    if (!existingDiscount) {
      throw new Error("Khuyến mãi không tồn tại.");
    }

    existingOrder.discountId = new mongoose.Types.ObjectId(body.discountId);
  }

  existingOrder.shippingAddressId = new mongoose.Types.ObjectId(
    body.shippingAddressId
  );
  existingOrder.paymentMethod = body.paymentMethod;
  existingOrder.status = OrderStatusEnum.PENDING;

  return await findByIdAndUpdate(existingOrder._id, existingOrder);
};

const findOrder = async (filter) => {
  return await orderModel.findOne(filter);
};

const findByIdAndUpdate = async (orderId, newInfomation) => {
  return await orderModel.findByIdAndUpdate(orderId, newInfomation);
};

module.exports = {
  processOrder,
  confirmOrder,
  findOrder,
  findByIdAndUpdate,
};
