"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var CouponSchema = new mongoose.Schema({
    code: String,
    amount: Number,
    type: { type: String, default: 'Discount' },
    active: { type: Boolean, default: true },
    info: String,
    minimumCartValue: Number
});
exports.default = mongoose.model('Coupon', CouponSchema);
//# sourceMappingURL=coupon.model.js.map