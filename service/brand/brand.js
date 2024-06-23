const mongoose = require("mongoose");
const brandsModel = require("../../model/brand.js");

const createNewBrand = async (brandData) => {
  try {
    const brand = new brandsModel(brandData);
    const savedBrand = await brand.save();
    return savedBrand;
  } catch (error) {
    throw error;
  }
};

const findBrandById = async (idBrand) => {
  return await brandsModel.findById(idBrand);
};

module.exports = {
  createNewBrand,
  findBrandById,
};
