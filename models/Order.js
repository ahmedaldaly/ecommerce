
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    product: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type:Number,
        default:1,
    },
    address: {
        type:String,
        default:'No titles added.',
    },
    status: {  // تم التصحيح هنا من stuts إلى status
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };
