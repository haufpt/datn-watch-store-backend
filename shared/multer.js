const bytes = require("bytes");
const Multer = require("multer");
const {
  fileStoragePath,
  fileLimitSize,
  FILE_MIME_TYPE_FORMAT,
} = require("../common/constants");
const { FileTypeEnum } = require("../common/enum");
const { default: AppError } = require("../utils/app-error");

const storage = Multer.diskStorage({
  destination: (req, file, callback) => {
    return callback(null, fileStoragePath);
  },
  filename(req, file, callback) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}_${file.originalname}`;

    return callback(null, filename);
  },
});

const uploadFile = (type) => {
  let size = bytes(fileLimitSize);
  let filter = fileFilter.any;

  switch (type) {
    case FileTypeEnum.MEDIA:
      filter = fileFilter.media;
      break;

    case FileTypeEnum.IMAGE:
      filter = fileFilter.image;
      break;

    case FileTypeEnum.ANY:
    default:
      break;
  }

  return Multer({
    storage: storage,
    limits: {
      fileSize: size,
    },
    fileFilter: filter,
  });
};

const fileFilter = {
  any: (req, file, callback) => {
    return callback(null, true);
  },

  media: (req, file, callback) => {
    const whiteList = [
      FILE_MIME_TYPE_FORMAT.IMAGE.PNG,
      FILE_MIME_TYPE_FORMAT.IMAGE.JPG,
      FILE_MIME_TYPE_FORMAT.IMAGE.JPEG,
      FILE_MIME_TYPE_FORMAT.IMAGE.GIF,
      FILE_MIME_TYPE_FORMAT.VIDEO.MP4,
    ];
    if (!whiteList.includes(file.mimetype)) {
      return callback(
        new AppError(
          400,
          "Only accepts media files: PNG, JPG, JPEG, MP4",
          39003
        )
      );
    }

    return callback(null, true);
  },

  image: (req, file, callback) => {
    const whiteList = [
      FILE_MIME_TYPE_FORMAT.IMAGE.PNG,
      FILE_MIME_TYPE_FORMAT.IMAGE.JPG,
      FILE_MIME_TYPE_FORMAT.IMAGE.JPEG,
    ];
    console.log("[fileFilter] image mimetype: ", file.mimetype);
    if (!whiteList.includes(file.mimetype)) {
      return callback(
        new AppError(400, "Only accepts image files: PNG, JPG, JPEG", 39004)
      );
    }

    return callback(null, true);
  },
};

module.exports = {
  uploadFile,
};
