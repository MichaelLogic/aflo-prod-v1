"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var review_controller_1 = require("./review.controller");
var controller = new review_controller_1.default();
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/my', auth.attachUserInfo(), controller.myReviewOfProduct);
router.get('/', controller.index);
router.get('/product/:id', controller.productReview);
router.get('/my/product/:id', auth.hasRole('user'), controller.index);
router.get('/:id', controller.get);
router.post('/', auth.hasRole('user'), controller.create);
router.put('/:id', auth.hasRole('manager'), controller.update);
router.patch('/:id', auth.hasRole('manager'), controller.update);
router.delete('/:id', auth.hasRole('user'), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map