"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var PaymentMethodSchema = new mongoose.Schema({
    name: String,
    email: String,
    options: Object,
    active: { type: Boolean, default: true }
});
exports.default = mongoose.model('PaymentMethod', PaymentMethodSchema);
//# sourceMappingURL=payment-method.model.js.map