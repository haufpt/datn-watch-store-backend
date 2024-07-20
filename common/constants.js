const accessTokenKey =
  "Jwt_nuijJ0iMxIimEN2TCgbEIYByoo8hZTdHqTsqbsyWsCvuBsTyTot6BJKRAzfFIKHsy2NljieTRo6BsydeJM1isTsZep1sbsgIeCK0h1fdijsaufhiudshighsdfiu";
const refreshTokenKey =
  "Jwt_nuijJ0iMxIimEN2TCgbEIYfgjhcfkshcgbdfhgfhdsigchnuakshngkuhsaicghaiufsdhgciusfahiguchasfniugchniafsuhgicshiagciufadsghcniuadsh";
const accessTokenExpires = "1d";
const refreshTokenExpires = "30d";
const fileLimitSize = "300mb";
const fileStoragePath = "public/uploads/";
const avatarDefault =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy1A_k7UaDKa3ojfuawpF8JHEzQj2EzWDEH_9XLFwMDMF74o_I5n0XsiO9teBALjDkj5E&usqp=CAU";
const FILE_MIME_TYPE_FORMAT = {
  IMAGE: {
    INDEX: "image",
    PNG: "image/png",
    JPG: "image/jpg",
    JPEG: "image/jpeg",
    GIF: "image/gif",
  },
  VIDEO: {
    INDEX: "video",
    MP4: "video/mp4",
  },
};

module.exports = {
  accessTokenKey,
  refreshTokenKey,
  accessTokenExpires,
  refreshTokenExpires,
  fileLimitSize,
  fileStoragePath,
  FILE_MIME_TYPE_FORMAT,
  avatarDefault,
};
