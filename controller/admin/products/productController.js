const productService = require("../../../service/product/product");
const brandService = require("../../../service/brand/brand");
const brandsModel = require("../../../model/brand.js");
const ProductValidation = require("../../../validation/product");
const {
  MachineCategoryEnum,
  WireCategoryEnum,
} = require("../../../common/enum");

const postProduct = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    const formData = req.body;
    console.log(
      `[productController][postProduct] formData _> ${JSON.stringify(formData)}`
    );

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

const updateProduct = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    let idProduct = req.params.idProduct;
    const formData = req.body;
    console.log(
      `[productController] editProduct formData _> ${JSON.stringify(formData)}`
    );

    const { error } = ProductValidation.addProduct.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message),
      });
    }

    if (req.files && req.files.length >= 0) {
      const photoUrls = req.files.map((file) => {
        if (!file.mimetype.startsWith("image/")) {
          throw new Error("File không phải là hình ảnh.");
        }
        return baseUrl + file.destination + file.filename;
      });
      formData.photoUrls = photoUrls;
    }

    formData.createdDate = new Date();

    await productService.updateProduct(idProduct, formData);

    res.status(201).json({
      success: true,
      message: `Cập nhật sản phầm thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const lockProduct = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    let { idProduct } = req.params;
    console.log("[productController] lockProduct: idProduct -> ", idProduct);
    const lockProduct = await productService.postLockProduct(idProduct);
    console.log(`[productController] lockProduct -> ${lockProduct}`);
    res.redirect(`${baseUrl}product/list-products?type=NEW`);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const listProduct = async (req, res) => {
  try {
    const { type, brandId, sortBy, brandName } = req.query;
    var searchQerry = req.query.search;
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 15;
    const listBrand = await brandsModel.find();
    console.log("[productController] listProduct: getlistBrand -> ", listBrand);

    let listProduct = await productService.getListProduct({
      type,
      page,
      limit,
      brandId,
      textSearch: searchQerry,
    });

    console.log("[productController] page -> ", page);
    
    console.log("[productController] listProduct -> ", listProduct);

    let listProduct2 = await productService.getListProduct({
      type,
      page,
      limit: 10000000000,
      brandId,
      textSearch: searchQerry,
    });

    if (brandId) {
      listProduct = listProduct.filter(
        (product) => product.brand.id === brandId
      );
      listProduct2 = listProduct2.filter(
        (product) => product.brand.id === brandId
      );
    } else if (brandName) {
      listProduct = listProduct.filter(
        (product) => product.brand.name === brandName
      );
      listProduct2 = listProduct2.filter(
        (product) => product.brand.name === brandName
      );
    }

    if (sortBy === "asc") {
      listProduct.sort((a, b) => a.price - b.price);
      listProduct2.sort((a, b) => a.price - b.price);
    } else if (sortBy === "desc") {
      listProduct.sort((a, b) => b.price - a.price);
      listProduct2.sort((a, b) => b.price - a.price);
    }

    let totalPages = Math.ceil(listProduct2.length / limit);;
    console.log("[productController] totalPages -> ", totalPages);
  
    res.render("./index.ejs", {
      title: "Danh sách sản phẩm",
      routerName: "product",
      info: req.session.account,
      listProductData: listProduct,
      listBrandData: listBrand,
      totalPages: totalPages,
      currentPage : page,
      limit: limit
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
      listBrandData: listBrand,
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
    let idProduct = req.params.idProduct;
    const listBrand = await brandsModel.find();
    const product = await productService.findProductByID(idProduct);
    console.log("[productController] detailProduct -> ", product);

    if (!product) {
      return res.status(301).json({
        success: false,
        message: `Product not found`,
      });
    }
    res.render("./index.ejs", {
      title: "Chi tiết sản phẩm",
      routerName: "detailProduct",
      info: req.session.account,
      productData: product,
      machineCategories: MachineCategoryEnum,
      WireCategories: WireCategoryEnum,
      listBrandData: listBrand,
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
  postProduct,
  updateProduct,
  lockProduct,
};
