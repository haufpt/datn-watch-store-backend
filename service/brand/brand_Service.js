const mongoose = require("mongoose");
const brandsModel = require("../../model/brandsModel.js");

const createNewBrand = async (brandData) => {
  try {
    const brand = new brandsModel(
      brandData
    );
    const savedBrand = await brand.save();
    return savedBrand;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewBrand,
};
