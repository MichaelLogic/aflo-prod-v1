"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var coupon_controller_1 = require("./coupon.controller");
var controller = new coupon_controller_1.default();
var router = express.Router();
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
router.get('/', controller.index);
router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/:id', controller.get);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map