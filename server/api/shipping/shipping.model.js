"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var ShippingSchema = new mongoose.Schema({
    name: String,
    info: String,
    carrier: String,
    country: String,
    charge: Number,
    minWeight: Number,
    maxWeight: Number,
    freeShipping: Number,
    active: Boolean
});
exports.default = mongoose.model('Shipping', ShippingSchema);
//# sourceMappingURL=shipping.model.js.map