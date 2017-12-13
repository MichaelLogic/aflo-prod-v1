"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Stripe = require("stripe");
var stripe = new Stripe(process.env.STRIPE_APIKEY);
var base_1 = require("./../base");
var order_model_1 = require("./../order/order.model");
var config_1 = require("../../config");
var config = new config_1.default();
var sendmail_1 = require("./../sendmail");
var email = new sendmail_1.default();
var shortId = require("shortid");
var orderNo = shortId.generate();
var StripeCtrl = (function (_super) {
    tslib_1.__extends(StripeCtrl, _super);
    function StripeCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = order_model_1.default;
        _this.createCustomer = function (req, res) {
            var items = [];
            var subtotal = 0;
            var discount = 0;
            var data = JSON.parse(req.query.data);
            console.log("REQUEST DATA:  ", data);
            var options = JSON.parse(req.query.options);
            console.log("REQUEST OPTIONS:  ", options);
            var total = data.price * data.quantity;
            var shortId = require('shortid');
            var orderNo = shortId.generate();
            stripe.customers.create({
                email: options.email
            })
                .then(function (customer) {
                return stripe.customers.createSource(customer.id, {
                    source: 'tok_visa'
                });
            })
                .then(function (source) {
                return stripe.charges.create({
                    amount: total,
                    currency: 'usd'
                    // customer: source.customer
                });
            })
                .then(function (charge) {
                // New charge created on a new customer
                console.log("STRIPE PAY RESPONSE:  ", charge);
            })
                .catch(function (err) {
                // Deal with an error
                console.log("STRIPE PAY ERROR:  ", err);
            });
        };
        return _this;
    }
    return StripeCtrl;
}(base_1.default));
exports.default = StripeCtrl;
//# sourceMappingURL=stripe.controller.js.map