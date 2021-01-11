const mongoose = require('mongoose');
const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, //tên của thể loại danh mục của sản phẩm
    description: {
        type: String,
        required: false,
    }, //mô tả loại sản phẩm
    status: {
        type: Boolean,
        required: true,
        default: true,
    }, //trạng thái của loại sản phẩm dùng/không dùng
    photo: {
        type: String,
        required: false,
    }, //ảnh của loại sản phẩm
});
typeSchema.set('timestamps', true);
module.exports = mongoose.model('Type', typeSchema);
