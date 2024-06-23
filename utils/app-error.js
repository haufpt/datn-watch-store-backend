const { ResponseStatusEnum } = require("../common/enum");

class AppError extends Error {
  constructor(statusCode, message, code, data) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.status = `${statusCode}`.startsWith("4")
      ? ResponseStatusEnum.FAILED
      : ResponseStatusEnum.ERROR;
    this.code = code ? code : statusCode;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
