"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.ObjectId;
var SuggestedGoodSchema = new mongoose.Schema({
    sku: String,
    name: String,
    nameLower: String,
    slug: String,
    category: { type: ObjectId, ref: 'Category' },
    brand: { type: ObjectId, ref: 'Brand' },
    description: String,
    variants: [{ image: String, price: Number, mrp: Number, weight: String, size: String }],
    features: Array,
    keyFeatures: Array,
    source_link: String,
    source_data_attributes: Object,
    created_at: { type: Date },
    updated_at: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    published: { type: Boolean, default: false },
}, {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
exports.default = mongoose.model('SuggestedGood', SuggestedGoodSchema);
//# sourceMappingURL=suggested-good.model.js.map