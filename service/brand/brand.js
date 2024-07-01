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

const listBrand = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const skip = (page - 1) * limit;
    const brands = await brandsModel.find().skip(skip).limit(limit);
    const totalBrands = await brandsModel.countDocuments();

    return {
      brands: brands,
      currentPage: page,
      totalPages: Math.ceil(totalBrands / limit),
      totalBrands,
    };
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
  listBrand,
};
