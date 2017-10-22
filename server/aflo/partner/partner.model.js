"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.ObjectId;
var PartnerSchema = new mongoose.Schema({
    companyName: String,
    description: String,
    uid: String,
    avatar: String,
    city: String,
    state: String,
    country: String,
    catalogSources: [{ type: ObjectId, ref: 'CatalogSource' }],
    suggestedGoods: Array,
    created_at: { type: Date },
    updated_at: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    approved: { type: Boolean, default: true },
}, {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
exports.default = mongoose.model('Partner', PartnerSchema);
//# sourceMappingURL=partner.model.js.map