const brandService = require("../../../service/brand/brand");
const brandValidation = require("../../../validation/brand");

const listBrand = async (req, res) => {
  try {
    const listBrand = await brandService.listBrand();
    console.log("[brandController] listBrand -> ", listBrand);
    res.render("./index.ejs", {
      title: "Danh sach thuong hieu",
      routerName: "list-brand",
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

const detailBrand = async (req, res) => {
  try {
    console.log("[brandController] listBrand -> ", listBrand);
    res.render("./index.ejs", {
      title: "Danh sach thuong hieu",
      routerName: "detail-brand",
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

const postBrand = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    const formData = req.body;

    const { error } = brandValidation.addBrand.validate(formData, {
      abortEarly: false,
    });
    console.log(`[BrandController] postBrand: formData -> ${JSON.stringify(formData)}`);
    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message),
      });
    }
    console.log(`[BrandController] files -> ${req.file}`);
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng tải lên ảnh." });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      throw new Error("File không phải là hình ảnh.");
    }

    const photoUrl = baseUrl + req.file.destination + req.file.filename;

    formData.logo = photoUrl;
    const newBrand = await brandService.createNewBrand(formData);

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

module.exports = {
  listBrand,
  detailBrand,
  postBrand,
};
