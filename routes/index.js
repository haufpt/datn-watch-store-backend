const accountRouter = require('./account/account');
const brandRouter = require('./brand/brand');
const productRouter = require('./product/product')

function route(app) {
    app.use('/account', accountRouter);
    app.use('/brand', brandRouter);
    app.use('/product', productRouter);
}

module.exports = route;
