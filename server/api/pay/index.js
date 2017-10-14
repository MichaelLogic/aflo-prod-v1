'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var paypal_controller_1 = require("./paypal.controller");
var controller = new paypal_controller_1.default();
var router = new express_1.Router();
router.get('/paypal', controller.PayPal);
router.get('/success', controller.success);
router.get('/process', controller.process);
router.get('/cancel', controller.cancel);
module.exports = router;
//# sourceMappingURL=index.js.map