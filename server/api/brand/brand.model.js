"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var BrandSchema = new mongoose.Schema({
    name: String,
    slug: String,
    info: String,
    parent: String,
    image: String,
    uid: String,
    brand: Number,
    active: { type: Boolean, default: true },
    updated: { type: Date, default: Date.now }
}, {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
exports.default = mongoose.model('Brand', BrandSchema);
//# sourceMappingURL=brand.model.js.map