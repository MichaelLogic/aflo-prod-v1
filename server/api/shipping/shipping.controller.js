"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var shipping_model_1 = require("./shipping.model");
var base_1 = require("./../base");
var _ = require("lodash");
var ShippingCtrl = (function (_super) {
    tslib_1.__extends(ShippingCtrl, _super);
    function ShippingCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = shipping_model_1.default;
        _this.my = function (req, res) {
            req.query.where = { uid: req.user._id };
            req.query.sort = '-updatedAt';
            _this.index(req, res);
        };
        _this.create = function (req, res) {
            req.body.uid = req.user._id;
            _this.insert(req, res);
        };
        // Get all features group
        _this.best = function (req, res) {
            if (req.query) {
                var params = req.query;
                var weight_1 = params.weight;
                var cartValue_1 = params.cartValue;
                var q = {};
                q.active = true;
                // q.country = params.country;
                var minPrice_1 = 1000000;
                var minFreeShipping_1 = 1000000;
                var best_1 = {};
                var free_1 = {};
                var vm_1 = _this;
                shipping_model_1.default.find(q, function (err, data) {
                    if (err)
                        vm_1.handleError(res, err);
                    if (data.length <= 0)
                        vm_1.handleError(res, err);
                    _.each(data, function (s) {
                        if (s.freeShipping <= cartValue_1) {
                            minPrice_1 = 0;
                            best_1 = s;
                            best_1.charge = 0;
                            free_1.carrier = s.carrier;
                            // return res.status(200).json([best]); // Converted to array as expected by the requester
                            return false;
                        }
                        if (isNaN(weight_1))
                            weight_1 = 0;
                        if (s.maxWeight > weight_1 && s.minWeight <= weight_1) {
                            if (s.charge < minPrice_1) {
                                minPrice_1 = s.charge;
                                best_1 = s;
                            }
                            if (s.freeShipping < minFreeShipping_1) {
                                minFreeShipping_1 = s.freeShipping;
                                free_1 = s;
                            }
                        }
                    });
                    var r = { best: best_1, free: free_1 };
                    return res.status(200).json([r]); // Converted to array as expected by the requester
                });
            }
        };
        return _this;
    }
    return ShippingCtrl;
}(base_1.default));
exports.default = ShippingCtrl;
//# sourceMappingURL=shipping.controller.js.map