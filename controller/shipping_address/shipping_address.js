const shippingAddressService = require("../../service/shipping_address/shipping_address");
const mongoose = require("mongoose");

const getListShippingAddress = async (req, res) => {
  try {
    const listShippingAddress =
      await shippingAddressService.getListShippingAddress(
        req.session.account.id
      );

    res.status(201).json({
      success: true,
      message: `Lấy danh sách địa chỉ giao hàng thành công.`,
      data: { addresses: listShippingAddress },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const createNewShippingAddress = async (req, res) => {
  try {
    const body = req.body;
    console.log(
      "[ShippingAddressController] createNewShippingAddress req.body: ",
      req.body
    );
    body.accountId = new mongoose.Types.ObjectId(req.session.account.id);

    await shippingAddressService.createNewShippingAddress(body);

    res.status(201).json({
      success: true,
      message: `Tạo địa chỉ giao hàng thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const deleteShippingAddress = async (req, res) => {
  try {
    const { shippingAddressId } = req.params;
    console.log(
      "[ShippingAddressController] deleteShippingAddress shippingAddressId: ",
      shippingAddressId
    );

    await shippingAddressService.deleteShippingAddress(
      req.session.account.id,
      shippingAddressId
    );

    res.status(201).json({
      success: true,
      message: `Xoá địa chỉ giao hàng thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const updateShippingAddress = async (req, res) => {
  try {
    const { shippingAddressId } = req.params;
    const body = req.body;
    console.log(
      "[ShippingAddressController] updateShippingAddress shippingAddressId: ",
      shippingAddressId
    );
    console.log(
      "[ShippingAddressController] updateShippingAddress req.body: ",
      body
    );

    await shippingAddressService.updateShippingAddressById(
      req.session.account.id,
      shippingAddressId,
      body
    );

    res.status(201).json({
      success: true,
      message: `Cập nhật địa chỉ giao hàng thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const setShippingAddressDefault = async (req, res) => {
  try {
    const { shippingAddressId } = req.params;
    console.log(
      "[ShippingAddressController] setShippingAddressDefault shippingAddressId: ",
      shippingAddressId
    );

    await shippingAddressService.setShippingAddressDefault(
      req.session.account.id,
      shippingAddressId
    );

    res.status(201).json({
      success: true,
      message: `Cập nhật địa chỉ giao hàng mặc định thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  getListShippingAddress,
  createNewShippingAddress,
  deleteShippingAddress,
  updateShippingAddress,
  setShippingAddressDefault,
};
