const authRouter = require('./auth');
const productRouter = require('./product');
const userRouter = require('./user');
const orderRouter = require('./order');
const typeRouter = require('./type');
const statistic = require('./statistic');
//Index of route middleware
const route = (app) => {
    //Route middleware auth
    app.use('/api/auth', authRouter);
    app.use('/api', productRouter);
    app.use('/api', userRouter);
    app.use('/api', orderRouter);
    app.use('/api', typeRouter);
    app.use('/api', statistic);
};

module.exports = route;
