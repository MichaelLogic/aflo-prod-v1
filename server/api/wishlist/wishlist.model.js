"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var WishlistSchema = new mongoose.Schema({
    product: { _id: ObjectId, name: String, slug: String, keyFeatures: [] },
    variant: { _id: ObjectId, size: String, weight: String, price: Number, mrp: Number, image: String },
    uid: ObjectId, name: String, email: String,
    created: { type: Date, default: Date.now }
});
exports.default = mongoose.model('Wishlist', WishlistSchema);
//# sourceMappingURL=wishlist.model.js.map