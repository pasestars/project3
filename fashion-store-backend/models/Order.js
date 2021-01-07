const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ['finished', 'completed', 'confirmed', 'unconfirmed', 'cart'],
            default: 'unconfirmed',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        totalPrice: {
            type: Number,
        },
        order: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                productID: String,
                amount: Number,
            },
        ],
    },
    {
        // Make Mongoose use Unix time (seconds since Jan 1, 1970)
        timestamps: { currentTime: () => Date.now() },
    }
);
orderSchema.set('timestamps', true);
module.exports = mongoose.model('Order', orderSchema);
