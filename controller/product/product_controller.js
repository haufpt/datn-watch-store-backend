const mongoose = require("mongoose");
const productService = require("../../service/product/product_Service")

const postProduct = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    const { name, description, price, quantity, size, machineCategory, wireCategory,brandId } = req.body;
    
    // Validate if required fields are present
    if (!name || !description || !price || !quantity || !size || !machineCategory || !wireCategory, !brandId) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if photoUrls array is provided
    if (!req.files || !req.files["photoUrls"] || req.files["photoUrls"].length === 0) {
        return res.status(400).json({ message: "Vui lòng tải lên ít nhất một ảnh." });
    }

    const photoUrls = req.files["photoUrls"].map(file => {
        if (!file.mimetype.startsWith("image/")) {
            throw new Error("File không phải là hình ảnh.");
        }
        return baseUrl + file.filename;
    });

    const createdDate = new Date(); // Assuming you want to use the current date as the creation date

    const newProduct = await productService.createNewProduct({
        name,
        description,
        price,
        quantity,
        photoUrls,
        createdDate,
        size,
        machineCategory,
        wireCategory,
        brandId
    });

    res.status(201).json({
        success: true,
        message: `Product created successfully`
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
    const listProduct = await productService.getListProduct();
    console.log("[listProduct]: ", listProduct);

    res.status(201).json({
      success: true,
      message: `Product get successfully`,
      data:listProduct
  });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
  
  
}

const findProductById = async (req, res) => {
  try {
    let idProduct = req.params.idProduct;
    const product = await productService.findProductByID(idProduct);
    console.log("[findProductById]: ", JSON.stringify(product));

    if (!product) {
      return res.status(301).json({
        success: false,
        message: `product not found`,
      });
    }
    res.status(201).json({
      success: true,
      message: `Product get successfully`,
      data:product
  });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
  
  
}

  module.exports = {
    postProduct,
    listProduct,
    findProductById
  };