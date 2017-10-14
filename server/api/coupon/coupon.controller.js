"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var coupon_model_1 = require("./coupon.model");
var base_1 = require("./../base");
var CouponCtrl = (function (_super) {
    tslib_1.__extends(CouponCtrl, _super);
    function CouponCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = coupon_model_1.default;
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
    return CouponCtrl;
}(base_1.default));
exports.default = CouponCtrl;
//# sourceMappingURL=coupon.controller.js.map