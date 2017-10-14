"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var aflo_media_model_1 = require("./aflo-media.model");
var base_1 = require("./../base");
var AfloMediaCtrl = (function (_super) {
    tslib_1.__extends(AfloMediaCtrl, _super);
    function AfloMediaCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = aflo_media_model_1.default;
        _this.my = function (req, res) {
            req.query.where = { uid: req.user._id };
            req.query.sort = '-updatedAt';
            _this.index(req, res);
        };
        // Creates a new Media in the DB
        _this.create = function (req, res) {
            req.body = req.files.file;
            req.body.uid = req.user._id;
            req.body.uname = req.user.name;
            req.body.uemail = req.user.email;
            _this.insert(req, res);
        };
        return _this;
    }
    return AfloMediaCtrl;
}(base_1.default));
exports.default = AfloMediaCtrl;
//# sourceMappingURL=aflo-media.controller.js.map