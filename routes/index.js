const accountRouter = require('./account/account');

function route(app) {
    app.use('/account', accountRouter);
}

module.exports = route;
