const searchHistoriesModel = require("../../model/search_histories.js");

const createNewSearchHistory = async (data) => {
  try {
    const searchHistory = new searchHistoriesModel(data);
    const savedBrand = await searchHistory.save();
    return savedBrand;
  } catch (error) {
    throw error;
  }
};

const findOne = async (filter) => {
  return await searchHistoriesModel.findOne(filter);
};

module.exports = {
  createNewSearchHistory,
  findOne,
};
