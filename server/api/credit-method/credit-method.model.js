"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var CreditMethodSchema = new mongoose.Schema({
    nickname: String,
    email: String,
    provider_cust_id: String,
    options: Object,
    active: { type: Boolean, default: true }
});
exports.default = mongoose.model('CreditMethod', CreditMethodSchema);
//# sourceMappingURL=credit-method.model.js.map