"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var FeatureSchema = new mongoose.Schema({
    key: String,
    val: String,
    info: String,
    active: Boolean
});
exports.default = mongoose.model('Feature', FeatureSchema);
//# sourceMappingURL=feature.model.js.map