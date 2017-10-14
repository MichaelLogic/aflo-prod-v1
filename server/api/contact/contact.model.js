"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var ContactSchema = new mongoose.Schema({
    name: String,
    photo: String,
    email: String,
    phone: String,
    category: String,
    active: Boolean,
    updatedAt: String,
    createdAt: String,
    modifiedBy: String
});
exports.default = mongoose.model('Contact', ContactSchema);
//# sourceMappingURL=contact.model.js.map