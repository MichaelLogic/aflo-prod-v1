"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var order_model_1 = require("./order.model");
var base_1 = require("./../base");
var config_1 = require("./../../config");
var config = new config_1.default();
var sendmail_1 = require("./../sendmail");
var email = new sendmail_1.default();
var OrderCtrl = (function (_super) {
    tslib_1.__extends(OrderCtrl, _super);
    function OrderCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = order_model_1.default;
        _this.pending = function (req, res) {
            req.query.where = { status: { $nin: ['Shipped', 'Delivered', 'Cancellation Requested', 'Cancelled'] } };
            req.query.sort = '-updated_at';
            _this.index(req, res);
        };
        _this.shipped = function (req, res) {
            req.query.where = { status: 'Shipped' };
            req.query.sort = '-updated_at';
            _this.index(req, res);
        };
        _this.cancelled = function (req, res) {
            req.query.where = { status: { $in: ['Cancellation Requested', 'Cancelled'] } };
            _this.index(req, res);
        };
        _this.delivered = function (req, res) {
            req.query.where = { status: 'Delivered' };
            req.query.sort = '-updated_at';
            _this.index(req, res);
        };
        // Get all orders by a user
        _this.myOrders = function (req, res) {
            req.query.where = { uid: req.user._id };
            req.query.sort = '-updated_at';
            _this.index(req, res);
        };
        _this.orderPlaced = function (res, statusCode) {
            if (statusCode === void 0) { statusCode = 200; }
            var vm = _this;
            return function (entity) {
                if (entity) {
                    var mailParams = { id: '', to: entity.email, orderNo: entity.orderNo, status: entity.status, payment_method: entity.payment.method, amount: entity.amount, address: entity.address };
                    email.send(config.orderPlacedEmail(mailParams));
                    res.status(statusCode).json(entity);
                }
            };
        };
        _this.orderUpdated = function (res, statusCode) {
            if (statusCode === void 0) { statusCode = 200; }
            var vm = _this;
            return function (entity) {
                if (entity) {
                    var mailParams = { id: '', to: entity.email, orderNo: entity.orderNo, status: entity.status, payment_method: entity.payment.method, amount: entity.amount, address: entity.address };
                    email.send(config.orderUpdatedEmail(mailParams));
                    res.status(statusCode).json(entity);
                }
            };
        };
        // Creates a new Order in the DB
        _this.create = function (req, res) {
            req.body.email = req.user.email; // id change on every user creation hence email is used
            var shortId = require('shortid');
            req.body.orderNo = shortId.generate();
            order_model_1.default.create(req.body).then(_this.orderPlaced(res, 201))
                .catch(_this.handleError(res));
        };
        _this.patch = function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            if (!req.body.slug && req.body.name)
                req.body.slug = req.body.name.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
            order_model_1.default.findById(req.params.id).exec()
                .then(_this.handleEntityNotFound(res))
                .then(_this.patchUpdates(req.body))
                .then(_this.orderUpdated(res))
                .catch(_this.handleError(res));
        };
        return _this;
    }
    return OrderCtrl;
}(base_1.default));
exports.default = OrderCtrl;
//# sourceMappingURL=order.controller.js.map