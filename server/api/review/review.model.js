"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var ReviewSchema = new mongoose.Schema({
    pid: ObjectId,
    pname: String,
    pslug: String,
    reviewer: String,
    email: String,
    vendor_id: { type: ObjectId, ref: 'User' },
    vendor_name: String,
    vendor_email: String,
    message: String,
    rating: Number,
    active: { type: Boolean, default: true },
    created: { type: Date, default: Date.now }
});
exports.default = mongoose.model('Review', ReviewSchema);
//# sourceMappingURL=review.model.js.map