"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var OrderSchema = new mongoose.Schema({
    uid: String,
    email: String,
    phone: String,
    orderNo: String,
    address: Object,
    payment: Object,
    amount: Object,
    exchange_rate: Number,
    items: [{ name: String, sku: { type: ObjectId, ref: 'Product' }, description: String, price: String, quantity: String, url: String, status: { type: String, default: 'Order Received' } }],
    status: { type: String, default: 'Order Placed' },
    comment: String,
    active: { type: Boolean, default: true },
    payment_method: String,
    created_at: { type: Date },
    updated_at: { type: Date }
});
OrderSchema.pre('save', function (next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});
exports.default = mongoose.model('Order', OrderSchema);
//# sourceMappingURL=order.model.js.map