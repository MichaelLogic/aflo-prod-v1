"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var paypal = require('paypal-rest-sdk');
var base_1 = require("./../base");
var order_model_1 = require("./../order/order.model");
var config_1 = require("../../config");
var config = new config_1.default();
var sendmail_1 = require("./../sendmail");
var email = new sendmail_1.default();
var OrderCtrl = (function (_super) {
    tslib_1.__extends(OrderCtrl, _super);
    function OrderCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = order_model_1.default;
        _this.PayPal = function (req, res, next) {
            var items = [];
            var subtotal = 0;
            var discount = 0;
            var data = JSON.parse(req.query.data);
            var options = JSON.parse(req.query.options);
            var total = data.price * data.quantity;
            var shortId = require('shortid');
            var orderNo = shortId.generate();
            // Set default checkout params
            options.exchange_rate = options.exchange_rate || 1;
            options.currency_code = options.paypal_currency;
            options.shipping = options.shipping || 0;
            options.discount = options.couponAmount || options.discount || 0;
            if (isNaN(options.exchange_rate) || options.exchange_rate === '')
                options.exchange_rate = 1;
            var shipping = Math.round(options.shipping * options.exchange_rate * 100) / 100;
            for (var k = 0; k < data.length; k++) {
                var i = data[k];
                var price = Math.round(i.price * options.exchange_rate * 100) / 100;
                subtotal = subtotal + price * i.quantity;
                items.push({ sku: i.sku, name: i.name, url: i.image, description: i.slug, price: price, quantity: i.quantity, currency: options.currency_code });
            }
            if (options.discount > 0) {
                discount = -Math.round(options.discount * options.exchange_rate * 100) / 100;
                items.push({ sku: '#', name: 'Coupon Discount', url: '-', description: '-', price: discount, quantity: 1, currency: options.currency_code });
            }
            subtotal = subtotal + discount;
            total = subtotal + shipping;
            paypal.configure({
                'mode': process.env.PAYPAL_MODE,
                'client_id': process.env.PAYPAL_CLIENT_ID,
                'client_secret': process.env.PAYPAL_CLIENT_SECRET
            });
            //build PayPal payment request
            var payReq = {
                'intent': 'sale',
                'redirect_urls': {
                    'return_url': process.env.DOMAIN + '/api/pay/process',
                    'cancel_url': process.env.DOMAIN + '/api/pay/cancel'
                },
                'payer': {
                    'payment_method': 'paypal',
                    'payer_info': {
                        'email': options.email,
                        'payer_id': options.uid
                    }
                },
                "transactions": [
                    {
                        "amount": {
                            "total": total,
                            "currency": options.currency_code,
                            "details": {
                                "subtotal": subtotal,
                                "shipping": shipping
                            }
                        },
                        "invoice_number": orderNo,
                        "custom": options.address.phone,
                        "item_list": {
                            "items": items,
                            "shipping_address": {
                                "recipient_name": options.address.recipient_name,
                                "line1": options.address.line1,
                                "city": options.address.city,
                                "postal_code": options.address.postal_code,
                                "state": "-",
                                "country_code": options.address.country_code
                            }
                        }
                    }
                ]
            };
            paypal.payment.create(payReq, function (error, payment) {
                if (error) {
                    console.log('########################## Error', error);
                    var msg = '', id = '000', code = ''; // When noting defined in server/.env this will return 000
                    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
                        msg = 'Not connected to internet';
                    }
                    else {
                        code = '404';
                        msg = JSON.stringify(error.response.details);
                    }
                    res.redirect('/admin/my-orders?id=' + id + '&msg=' + msg);
                }
                else {
                    if (payment.state === 'created')
                        payment.state = 'Pending';
                    var orderDetails = {
                        uid: payment.payer.payer_info.payer_id, email: options.email,
                        phone: payment.transactions[0].custom,
                        orderNo: payment.transactions[0].invoice_number,
                        address: payment.transactions[0].item_list.shipping_address,
                        status: 'Payment Initiated',
                        items: payment.transactions[0].item_list.items,
                        payment: { id: payment.id, state: payment.state, cart: payment.cart, email: payment.payer.payer_info.email, method: payment.payer.payment_method },
                        amount: payment.transactions[0].amount,
                        created: payment.created_time,
                    };
                    orderDetails.amount.exchange_rate = options.exchange_rate;
                    // When order.status is null, the client will replace with the Array[0] of order status at Settings page
                    // Order.create is from order.model not from order.controller
                    order_model_1.default.create(orderDetails);
                    //capture HATEOAS links
                    var links_1 = {};
                    payment.links.forEach(function (linkObj) {
                        links_1[linkObj.rel] = {
                            'href': linkObj.href,
                            'method': linkObj.method
                        };
                    });
                    //if redirect url present, redirect user
                    if (links_1.hasOwnProperty('approval_url')) {
                        res.redirect(links_1['approval_url'].href);
                    }
                    else {
                        console.error('no redirect URI present');
                    }
                }
            });
        };
        _this.success = function (req, res, next) {
            var paymentId = req.session.paymentId;
            var paymentDetails = { payer_id: req.query.PayerID };
            paypal.payment.execute(paymentId, paymentDetails, function (err) {
                res.render('api/paypal', {
                    result: true,
                    success: !err
                });
            });
        };
        _this.process = function (req, res) {
            var paymentId = req.query.paymentId;
            var payerId = { 'payer_id': req.query.PayerID };
            var string = "";
            paypal.payment.execute(paymentId, payerId, function (error, payment) {
                if (error) {
                    // console.log('payment process error', error);
                    order_model_1.default.findOneAndUpdate({ 'payment.id': paymentId }, { status: 'Payment Error' }, { upsert: false, setDefaultsOnInsert: true, runValidators: true }).exec();
                    string = encodeURIComponent('Error occured while receiving payment');
                    res.redirect('/admin/my-orders?id=' + paymentId + '&msg=' + string);
                }
                else {
                    var mailParams_1 = {
                        id: payment.id,
                        to: payment.payer.payer_info.email,
                        orderNo: payment.transactions[0].invoice_number,
                        status: payment.state,
                        payment_method: payment.payer.payment_method,
                        amount: payment.transactions[0].amount,
                        address: payment.payer.payer_info.shipping_address
                    };
                    if (payment.state === 'approved') {
                        order_model_1.default.findOneAndUpdate({ 'payment.id': payment.id }, { "status": 'Paid', "payment.state": 'Paid' }, { upsert: false, setDefaultsOnInsert: true, runValidators: true }).exec()
                            .then(function (doc) {
                            email.send(config.orderPlacedEmail(mailParams_1));
                            string = encodeURIComponent("Order Placed");
                            res.redirect('/admin/my-orders?id=' + paymentId + '&msg=' + string);
                        }).then(function (err) {
                            if (err) {
                                // console.log('Could not find the payment reference',err);
                                email.send(config.orderPlacedEmail(mailParams_1));
                                string = encodeURIComponent("Payment Not Received");
                                res.redirect('/admin/my-orders?id=' + paymentId + '&msg=' + string);
                            }
                        });
                    }
                    else {
                        order_model_1.default.findOneAndUpdate({ 'payment.id': payment.id }, { status: 'Payment Not Approved' }, { upsert: false, setDefaultsOnInsert: true, runValidators: true }).exec();
                        string = encodeURIComponent('Payment Not Approved');
                        res.redirect('/admin/my-orders?id=' + paymentId + '&msg=' + string);
                    }
                }
            });
        };
        _this.cancel = function (req, res) {
            var string = encodeURIComponent('Payment Cancelled');
            res.redirect('/admin/my-orders?msg=' + string);
        };
        return _this;
    }
    return OrderCtrl;
}(base_1.default));
exports.default = OrderCtrl;
//# sourceMappingURL=paypal.controller.js.map