"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var orderHistory_model_1 = require("./orderHistory.model");
var base_1 = require("./../base");
var OrderHistoryCtrl = (function (_super) {
    tslib_1.__extends(OrderHistoryCtrl, _super);
    function OrderHistoryCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = orderHistory_model_1.default;
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
    return OrderHistoryCtrl;
}(base_1.default));
exports.default = OrderHistoryCtrl;
//# sourceMappingURL=orderHistory.controller.js.map