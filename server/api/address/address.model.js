"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var AddressSchema = new mongoose.Schema({
    email: String,
    name: String,
    address: String,
    city: String,
    state: String,
    country: Object,
    zip: Number,
    phone: String,
    active: { type: Boolean, default: true },
    uid: { type: ObjectId, ref: 'User' }
}, {
    timestamps: true
});
exports.default = mongoose.model('Address', AddressSchema);
//# sourceMappingURL=address.model.js.map