const express = require('express');
const multer = require("multer");
const router = express.Router();
const brandController = require('../../controller/brand/brand_Controller');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const fileConfig = `${file.fieldname}-${Date.now()}-${file.originalname}`;
    cb(null, fileConfig);
  },
});
var upload = multer({ storage: storage });

router.post('/post-brand',upload.fields([{ name: 'logo', maxCount: 1 }]) , brandController.postBrand );

module.exports = router;
