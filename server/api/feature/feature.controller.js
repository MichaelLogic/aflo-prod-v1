"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var feature_model_1 = require("./feature.model");
var base_1 = require("./../base");
var FeatureCtrl = (function (_super) {
    tslib_1.__extends(FeatureCtrl, _super);
    function FeatureCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = feature_model_1.default;
        _this.my = function (req, res) {
            req.query.where = { uid: req.user._id };
            req.query.sort = '-updatedAt';
            _this.index(req, res);
        };
        _this.create = function (req, res) {
            req.body.uid = req.user._id;
            _this.insert(req, res);
        };
        // import Feature from './feature.model';
        // import * as helper from './../../components/helper';
        // Get all features group
        _this.group = function (req, res) {
            var async = require("async");
            var fe = [];
            feature_model_1.default.find().distinct('key', function (err, feature) {
                var f = {};
                async.each(feature, function (k, callback) {
                    var x = {};
                    x.key = k;
                    x.v = [];
                    feature_model_1.default.find({ key: k, active: true }).distinct('val').exec(function (err, v) {
                        x.v = v;
                        fe.push(x);
                        callback();
                    });
                }, 
                // 3rd param is the function to call when everything's done
                function (err) {
                    if (err) {
                        return res.status(404).send('Not Found');
                    }
                    else {
                        return res.status(200).json(fe);
                    }
                });
            });
        };
        return _this;
    }
    return FeatureCtrl;
}(base_1.default));
exports.default = FeatureCtrl;
//# sourceMappingURL=feature.controller.js.map