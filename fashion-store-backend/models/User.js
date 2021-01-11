const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 30,
    }, //tên người dùng
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    }, //địa chỉ email của người dùng
    phone: {
        type: String,
        required: false,
    }, //số điện thoại của người dùng
    birthday: {
        type: String,
    }, //ngày sinh của người dùng
    gender: {
        type: String,
        enum: ['male', 'female', 'secret'],
        required: true,
        default: 'secret',
    }, //giới tính của người dùng, mặc định là secret
    address: {
        type: String,
        required: true,
    }, //địa chỉ của người dùng
    password: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    }, //mật khẩu của người dùng
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer',
    }, //vai trò của người dùng trong hệ thống
    photo: String, //ảnh của người dùng
});
userSchema.set('timestamps', true);
module.exports = mongoose.model('User', userSchema);
