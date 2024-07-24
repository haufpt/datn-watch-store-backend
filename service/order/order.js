const { OrderStatusEnum, DiscountTypeEnum } = require("../../common/enum");
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
    const orderSaved = await getDetailOrder(resultOrder._id, session);
    await session.commitTransaction();
    session.endSession();
    return orderSaved;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const confirmOrder = async (data) => {
  const { accountId, orderId, body } = data;
  console.log("[OrderService] confirmOrder data: ", data);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
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

      const discountAmount =
        existingDiscount.discountType === DiscountTypeEnum.PERCENT
          ? (existingDiscount.discountValue / 100) * existingOrder.totalAmount
          : existingDiscount.discountValue;
      existingOrder.discountId = new mongoose.Types.ObjectId(body.discountId);
      existingOrder.discountAmount = discountAmount;
    }

    existingOrder.shippingAddressId = new mongoose.Types.ObjectId(
      body.shippingAddressId
    );
    existingOrder.paymentMethod = body.paymentMethod;
    existingOrder.status = OrderStatusEnum.PENDING;

    await findByIdAndUpdate(existingOrder._id, existingOrder, session);

    await CartService.deleteMany(
      {
        accountId: new mongoose.Types.ObjectId(accountId),
      },
      session
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const findOrder = async (filter) => {
  return await orderModel.findOne(filter);
};

const findByIdAndUpdate = async (orderId, newInfomation, session) => {
  return await orderModel.findByIdAndUpdate(orderId, newInfomation, {
    new: true,
    session,
  });
};

const getDetailOrder = async (orderId, session) => {
  console.log("getDetailOrder: ", orderId.toString());
  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId.toString()),
      },
    },
    {
      $lookup: {
        from: "shipping_addresses",
        localField: "shippingAddressId",
        foreignField: "_id",
        as: "shippingAddresses",
      },
    },
    {
      $addFields: {
        shippingAddress: { $arrayElemAt: ["$shippingAddresses", 0] },
      },
    },
    {
      $lookup: {
        from: "discounts",
        localField: "discountId",
        foreignField: "_id",
        as: "discounts",
      },
    },
    {
      $addFields: {
        shippingAddress: { $arrayElemAt: ["$discounts", 0] },
      },
    },
    {
      $lookup: {
        from: "order_items",
        localField: "_id",
        foreignField: "orderId",
        as: "orderItems",
        pipeline: [
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $unwind: {
              path: "$product",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $project: {
              _id: 1,
              quantity: 1,
              product: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        shippingAddress: 1,
        discount: 1,
        orderItems: 1,
        orderDate: 1,
        estDeliveryDate: 1,
        status: 1,
        paymentMethod: 1,
        code: 1,
      },
    },
  ];

  const orders = await orderModel.aggregate(pipeline).session(session);
  if (orders.length != 1) {
    return null;
  }
  return orders[0];
};

module.exports = {
  processOrder,
  confirmOrder,
  findOrder,
  findByIdAndUpdate,
  getDetailOrder,
};
