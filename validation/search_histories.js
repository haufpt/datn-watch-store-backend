const Joi = require("joi");

class SearchHistoriesValidation {
  static getSearchHistories = {
    query: Joi.object().keys({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).optional(),
    }),
  };
}

module.exports = SearchHistoriesValidation;
