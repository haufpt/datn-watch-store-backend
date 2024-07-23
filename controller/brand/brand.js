const mongoose = require("mongoose");
const path = require("path");
const brandService = require("../../service/brand/brand");

const postBrand = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    const { name, description } = req.body;
    console.log(`[postBrand] name -> ${name}`);
    console.log(`[postBrand] description -> ${description}`);
    if (!req.files || !req.files["logo"] || req.files["logo"].length === 0) {
      return res.status(400).json({ message: "Vui lòng tải lên file logo." });
    }
    const logoFile = req.files["logo"][0];
    if (!logoFile.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "File không phải là hình ảnh." });
    }
    const logoPath = path.join(
      __dirname,
      "../../public/uploads/",
      logoFile.filename
    );
    const url = `${baseUrl}${logoFile.filename}`;
    console.log(`[postBrand] logoPath -> ${url}`);

    const newBrandData = {
      name: name,
      description: description,
      logo: url,
    };
    const newBrand = await brandService.createNewBrand(newBrandData);

    res.status(201).json({
      success: true,
      message: `Tạo Brand thành công`,
      data: newBrand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const getBrand = async (req, res) => {
  try {
    const { page, limit } = req.query;
    console.log("[BrandController] getBrand req.query: ", req.query);

    const brands = await brandService.listBrand({ page: page, limit: limit });

    res.status(200).json({
      success: true,
      message: `Lấy danh sách brand thành công.`,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const getDatailBrand = async (req, res) => {
  try {
    let idBrand = req.params.idBrand;
    const brand = await brandService.findBrandById(idBrand);
    console.log("[brandController] getDatailBrand: brand -> ", brand);

    if (!product) {
      return res.status(301).json({
        success: false,
        message: `Brand not found`,
      });
    }
    res.render("./index.ejs", {
      title: "Chi tiết thương hiệu",
      routerName: "detailProduct",
      info: req.session.account,
      brandData: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  postBrand,
  getBrand,
  getDatailBrand
};
