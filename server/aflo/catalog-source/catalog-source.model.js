"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.ObjectId;
var CatalogSourceSchema = new mongoose.Schema({
    title: String,
    description: String,
    sourcePath: String,
    suggestedGoods: Array,
    created_at: { type: Date },
    updated_at: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    approved: { type: Boolean, default: true }
}, {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
exports.default = mongoose.model('CatalogSource', CatalogSourceSchema);
//# sourceMappingURL=catalog-source.model.js.map