const productService = require("../../../service/product/product");
const brandService = require("../../../service/brand/brand");
const brandsModel = require("../../../model/brand.js");
const ProductValidation = require("../../../validation/product");

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
    res.render("./index.ejs", {
      title: "Danh sách sản phẩm",
      routerName: "product",
      info: req.session.account,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const listBrand = await brandsModel.find();
    console.log("[productController] addProduct: getlistBrand -> ", listBrand);
    res.render("./index.ejs", {
      title: "Thêm mới sản phẩm",
      routerName: "addProduct",
      info: req.session.account,
      listBrandData: listBrand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const detailProduct = async (req, res) => {
  try {
    res.render("./index.ejs", {
      title: "Chi tiet san pham",
      routerName: "detailProduct",
      info: req.session.account,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  listProduct,
  addProduct,
  detailProduct,
  postProduct
};
