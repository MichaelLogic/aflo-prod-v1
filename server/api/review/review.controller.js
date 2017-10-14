"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var review_model_1 = require("./review.model");
var base_1 = require("./../base");
var config_1 = require("./../../config");
var config = new config_1.default();
var ReviewCtrl = (function (_super) {
    tslib_1.__extends(ReviewCtrl, _super);
    function ReviewCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = review_model_1.default;
        _this.productReview = function (req, res) {
            req.query.where = { pid: req.params.id };
            req.query.sort = '-created';
            _this.index(req, res);
        };
        _this.myReviewOfProduct = function (req, res) {
            var q = { email: req.user.email };
            if (req.user.role === 'vendor')
                q = { $or: [{ vendor_email: req.user.email }, { email: req.user.email }] };
            if (req.user.role === 'admin')
                q = {};
            req.query.where = q;
            req.query.sort = '-created';
            _this.index(req, res);
        };
        // Gets a list of Reviews for product-details page
        _this.my = function (req, res) {
            var q = { pid: req.query.pid, active: true };
            if (req.user)
                q = { $or: [q, { email: req.user.email, pid: req.query.pid }] };
            req.query.where = q;
            _this.index(req, res);
        };
        // Creates a new Review in the DB
        _this.create = function (req, res) {
            req.body.uid = req.user.email;
            if (config.reviewSettings.moderate)
                req.body.active = false;
            _this.insert(req, res);
        };
        return _this;
    }
    return ReviewCtrl;
}(base_1.default));
exports.default = ReviewCtrl;
//# sourceMappingURL=review.controller.js.map