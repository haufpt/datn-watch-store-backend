const Joi = require("joi");

class StatisticalValidation {
  static getStatistical = Joi.object({
    startDate: Joi.string().optional(),
    endDate: Joi.string().required(),
  });
}

module.exports = StatisticalValidation;
