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

const listBrand = async ({ page = 1, limit = 15, searchQuery } = {}) => {
  try {
    let query = {};
    if (searchQuery) {
      query = { name: { $regex: searchQuery, $options: 'i' } };
    }

    const skip = (page - 1) * limit;
    
    const brands = await brandsModel.find(query).skip(skip).limit(limit);
    
    // Để tính tổng số trang, thì cũng cần áp dụng query tương tự
    const brand2 = await brandsModel.find(query).skip(skip).limit(1000000000);
    const totalPage = Math.ceil(brand2.length / limit);

    return {
      brands: brands,
      currentPage: page,
      limit: limit,
      totalPages: totalPage
    };
  } catch (error) {
    throw error;
  }
};

const findBrandById = async (idBrand) => {
  return await brandsModel.findById(idBrand);
};

const updateBrand = async (idBrand, updatedData) => {
  try {
    const brand = await brandsModel.findById(idBrand);
    if (!brand) throw new Error("Brand not found");

    const existingBrand = await brandsModel.findOne({
      _id: { $ne: idBrand },
      name: updatedData.name
    });
    if (existingBrand) throw new Error("Brand name already exists");

    Object.assign(brand, updatedData);

    return brand.save();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewBrand,
  findBrandById,
  listBrand,
  updateBrand
};
