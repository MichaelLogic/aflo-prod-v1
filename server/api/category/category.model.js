"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var SubCategorySchema = new mongoose.Schema({
    index: Number,
    name: String,
    slug: String,
    img: String,
    uid: String,
    updated: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
});
var CategorySchema = new mongoose.Schema({
    index: Number,
    name: String,
    slug: String,
    img: String,
    uid: String,
    updated: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    children: [SubCategorySchema],
});
CategorySchema.pre('save', function (next) {
    if (!this.slug && this.name)
        this.slug = slugify(this.name);
    next();
});
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}
exports.default = mongoose.model('Category', CategorySchema);
//# sourceMappingURL=category.model.js.map