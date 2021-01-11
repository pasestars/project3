const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ['finished', 'completed', 'confirmed', 'unconfirmed', 'cart'],
            default: 'unconfirmed',
        }, //trạng thái của đơn hàng, có 5 trạng thái
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }, //id người dùng đặt hàng
        totalPrice: {
            type: Number,
        }, //tổng giá tiền của đơn hàng
        order: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                }, //id sản phẩm được đặt hàng
                productID: String, //mã của sản phẩm được đặt hàng
                amount: Number, //tổng số lượng của từng sản phẩm
            },
        ], //mảng các sản phẩm được đặt hàng
    },
    {
        // Make Mongoose use Unix time (seconds since Jan 1, 1970)
        timestamps: { currentTime: () => Date.now() },
    }
);
orderSchema.set('timestamps', true);
module.exports = mongoose.model('Order', orderSchema);
