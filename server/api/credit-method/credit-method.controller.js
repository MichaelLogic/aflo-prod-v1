"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var credit_method_model_1 = require("./credit-method.model");
var base_1 = require("./../base");
var CreditMethodCtrl = (function (_super) {
    tslib_1.__extends(CreditMethodCtrl, _super);
    function CreditMethodCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = credit_method_model_1.default;
        _this.my = function (req, res) {
            req.query.where = { uid: req.user._id };
            req.query.sort = '-updatedAt';
            _this.index(req, res);
        };
        _this.create = function (req, res) {
            req.body.uid = req.user._id;
            _this.insert(req, res);
        };
        //Get list of active CreditMethods
        _this.active = function (req, res) {
            credit_method_model_1.default.find({ active: true }).exec(function (err, CreditMethods) {
                if (err) {
                    return this.handleError(res, err);
                }
                return res.status(200).json(CreditMethods);
            });
        };
        return _this;
    }
    return CreditMethodCtrl;
}(base_1.default));
exports.default = CreditMethodCtrl;
//# sourceMappingURL=credit-method.controller.js.map