"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var address_model_1 = require("./address.model");
var base_1 = require("./../base");
var AddressCtrl = (function (_super) {
    tslib_1.__extends(AddressCtrl, _super);
    function AddressCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = address_model_1.default;
        _this.my = function (req, res) {
            req.query.where = { uid: req.user._id };
            req.query.sort = '-updatedAt';
            _this.index(req, res);
        };
        _this.create = function (req, res) {
            req.body.uid = req.user._id;
            _this.insert(req, res);
        };
        return _this;
    }
    return AddressCtrl;
}(base_1.default));
exports.default = AddressCtrl;
//# sourceMappingURL=address.controller.js.map