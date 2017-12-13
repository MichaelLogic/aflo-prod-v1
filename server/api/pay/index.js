'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var paypal_controller_1 = require("./paypal.controller");
var stripe_controller_1 = require("./stripe.controller");
var stripeCtrl = new stripe_controller_1.default();
var paypalCtrl = new paypal_controller_1.default();
var router = new express_1.Router();
router.get('/stripe', stripeCtrl.createCustomer);
router.get('/paypal', paypalCtrl.PayPal);
router.get('/success', paypalCtrl.success);
router.get('/process', paypalCtrl.process);
router.get('/cancel', paypalCtrl.cancel);
module.exports = router;
//# sourceMappingURL=index.js.map