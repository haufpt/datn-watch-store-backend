const mongoose = require("mongoose");
const productService = require("../../service/product/product");
const cartService = require("../../service/cart/cart");
const ProductValidation = require("../../validation/product");
const account = require("../../model/account");

const postProduct = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";

    const formData = {
      brandId: req.body.brandId,
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      size: parseFloat(req.body.size),
      machineCategory: req.body.machineCategory,
      wireCategory: req.body.wireCategory,
    };

    const { error } = ProductValidation.addProduct.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message),
      });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Vui lòng tải lên ít nhất một ảnh." });
    }

    const photoUrls = req.files.map((file) => {
      if (!file.mimetype.startsWith("image/")) {
        throw new Error("File không phải là hình ảnh.");
      }
      return baseUrl + file.destination + file.filename;
    });

    formData.photoUrls = photoUrls;
    formData.createdDate = new Date();

    await productService.createNewProduct(formData);

    res.status(201).json({
      success: true,
      message: `Tạo sản phầm thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const listProduct = async (req, res) => {
  try {
    const { page, limit, type, brandId } = req.query;
    console.log("[ProductController] listProduct req.query: ", req.query);

    const listProduct = await productService.getListProduct({
      type,
      page,
      limit,
      brandId,
    });

    res.status(201).json({
      success: true,
      message: `Lấy danh sách sản phẩm thành công.`,
      data: listProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const findProductById = async (req, res) => {
  try {
    const idProduct = req.params.idProduct;
    const product = await productService.findProductByID(idProduct);
    console.log(
      "[ProductController] findProductById: ",
      JSON.stringify(product)
    );

    if (!product) {
      return res.status(301).json({
        success: false,
        message: `Không tìm thấy sản phẩm.`,
      });
    }

    res.status(201).json({
      success: true,
      message: `Lấy sản phẩm thành công.`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const addProductToCart = async (req, res) => {
  try {
    console.log(
      `[ProductController] addProductToCart req.params: ${req.params}`
    );
    console.log("[ProductController] addProductToCart req.body: ", req.body);
    const body = {
      accountId: req.session.account.id,
      productId: req.params.productId,
      quantity: req.body.quantity,
      type: req.body.type,
    };

    await productService.addProductToCart(body);

    const listCart = await cartService.getListCart(req.session.account.id);

    res.status(201).json({
      success: true,
      message: `Cập nhật giỏ hàng thành công.`,
      data: {
        carts: listCart,
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
  postProduct,
  listProduct,
  findProductById,
  addProductToCart,
};
