const mongoose = require("mongoose");
const productModel = require("../../model/productsModel.js");

const createNewProduct = async (data) => {
  try {
    const product = new productModel(data);
    console.log("data product:  ", product);
    const createdCycleCourse = await product.save();
    return createdCycleCourse;
  } catch (error) {
    throw error;
  }
};


module.exports = {
    createNewProduct
};
