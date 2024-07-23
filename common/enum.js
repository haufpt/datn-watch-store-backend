const OsPlatformEnum = {
  ANDROID: "android",
  IOS: "ios",
};

const AccountRoleEnum = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
};

const MachineCategoryEnum = {
  AUTOMATIC_MECHANICAL: "AUTOMATIC_MECHANICAL",
  BATTERY: "BATTERY",
  LIGHT_ENERGY: "LIGHT_ENERGY",
};

const WireCategoryEnum = {
  METAL: "METAL",
  SKIN: "SKIN",
  PLASTIC: "PLASTIC",
  FABRIC: "FABRIC",
};

const FileTypeEnum = {
  ANY: "ANY",
  MEDIA: "MEDIA",
  IMAGE: "IMAGE",
};

const ResponseStatusEnum = {
  SUCCESS: "success",
  FAILED: "failed",
  ERROR: "error",
};

const TopProductTypeEnum = {
  SALE: "SALE",
  POPULAR: "POPULAR",
  NEW: "NEW",
  COLLECTION: "COLLECTION",
  PRICE: "PRICE",
};

const UpdateCartTypeEnum = {
  PLUS: "PLUS",
  MINUS: "MINUS",
};

const OrderStatusEnum = {
  PROCESSING: "PROCESSING",
  PENDING: "PENDING",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const PaymentStatusEnum = {
  VNPAY: "VNPAY",
  CASH: "CASH",
};

const DiscountTypeEnum = {
  PERCENT: "PERCENT",
  PERMANENT: "PERMANENT",
};

module.exports = {
  OsPlatformEnum,
  AccountRoleEnum,
  MachineCategoryEnum,
  WireCategoryEnum,
  FileTypeEnum,
  ResponseStatusEnum,
  TopProductTypeEnum,
  UpdateCartTypeEnum,
  OrderStatusEnum,
  PaymentStatusEnum,
  DiscountTypeEnum,
};
