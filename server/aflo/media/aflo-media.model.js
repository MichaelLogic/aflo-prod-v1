"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var AfloMediaSchema = new mongoose.Schema({
    originalFilename: String,
    src: String,
    path: String,
    size: String,
    type: String,
    name: String,
    uid: { type: ObjectId, ref: "User" },
    createdAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
    uname: String,
    uemail: String,
    use: String,
    active: { type: Boolean, default: true }
});
AfloMediaSchema.pre('save', function (next) {
    var now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
exports.default = mongoose.model('AfloMedia', AfloMediaSchema);
//# sourceMappingURL=aflo-media.model.js.map