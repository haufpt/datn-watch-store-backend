const bytes = require('bytes');
const Multer = require('multer');
const { FILE_MIME_TYPE_FORMAT } = require('../common/constant');
const { HTTP_RESPONSE, HTTP_STATUS } = require('../common/http-response');
const AppError = require('../utils/app-error');
const { FileTypeEnum } = require('../common/enum');
const { fileStoragePath, fileLimitSize } = require('../common/constants');

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

    case FileTypeEnum.DOCUMENT:
      filter = fileFilter.document;
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
          HTTP_STATUS.BAD_REQUEST,
          HTTP_RESPONSE.FILE.ACCEPT_MEDIA.MESSAGE,
          HTTP_RESPONSE.FILE.ACCEPT_MEDIA.CODE
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
    if (!whiteList.includes(file.mimetype)) {
      return callback(
        new AppError(
          HTTP_STATUS.BAD_REQUEST,
          HTTP_RESPONSE.FILE.ACCEPT_IMAGE.MESSAGE,
          HTTP_RESPONSE.FILE.ACCEPT_IMAGE.CODE
        )
      );
    }

    return callback(null, true);
  },

  document: (req, file, callback) => {
    const whiteList = [
      FILE_MIME_TYPE_FORMAT.DOCUMENT.PDF,
      FILE_MIME_TYPE_FORMAT.DOCUMENT.XLS,
      FILE_MIME_TYPE_FORMAT.DOCUMENT.XLSX,
      FILE_MIME_TYPE_FORMAT.DOCUMENT.DOC,
      FILE_MIME_TYPE_FORMAT.DOCUMENT.DOCX,
      FILE_MIME_TYPE_FORMAT.DOCUMENT.PPT,
      FILE_MIME_TYPE_FORMAT.DOCUMENT.PPTX,
      FILE_MIME_TYPE_FORMAT.DOCUMENT.TXT,
    ];
    if (!whiteList.includes(file.mimetype)) {
      return callback(
        new AppError(
          HTTP_STATUS.BAD_REQUEST,
          HTTP_RESPONSE.FILE.ACCEPT_DOCUMENT.MESSAGE,
          HTTP_RESPONSE.FILE.ACCEPT_DOCUMENT.CODE
        )
      );
    }

    return callback(null, true);
  },
};

module.exports = {
  uploadFile,
};
