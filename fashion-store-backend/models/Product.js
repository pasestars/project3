const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    productID: {
        type: String,
        required: true,
    }, //mã sản phẩm
    name: {
        type: String,
        required: true,
        min: 0,
        max: 255,
    }, //tên sản phẩm
    description: {
        type: String,
        required: false,
        max: 1023,
        min: 0,
    }, //mô tả của sản phẩm
    status: {
        type: Boolean,
        required: true,
    }, // trạng thái bán/không bán của sản phẩm
    price: {
        type: Number,
        required: true,
    }, //giá của sản phẩm
    photo: {
        type: String,
        required: false,
    }, //ảnh của sản phẩm
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
    }, //loại của sản phẩm, liên kết với model Type
    book: [
        {
            time: {
                type: Date,
                required: true,
                default: Date.now,
            }, //thời gian đặt sản phẩm
            amount: {
                type: Number,
                default: 0,
            }, //số lượng của sản phẩm được đặt trong thời gian trên
        },
    ], // lưu các thông tin sản phẩm đã bán, dùng để thống kê
});
productSchema.set('timestamps', true);
module.exports = mongoose.model('Product', productSchema);
