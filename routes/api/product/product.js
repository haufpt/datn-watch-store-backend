var express = require('express');
var router = express.Router();
const multer = require("multer");
const productController = require('../../../controller/product/product_controller');
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


router.get('/list-product',  productController.listProduct);
router.get('/get-product-by-id/:idProduct',  productController.findProductById);
router.post('/add-product', upload.fields([{name: "photoUrls"}]), productController.postProduct);

module.exports = router;
