"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var CustomerSchema = new mongoose.Schema({
    name: String,
    address: String,
    photo: String,
    country: String,
    active: Boolean,
    updatedAt: String,
    createdAt: String,
    modifiedBy: String
});
exports.default = mongoose.model('Customer', CustomerSchema);
//# sourceMappingURL=customer.model.js.map