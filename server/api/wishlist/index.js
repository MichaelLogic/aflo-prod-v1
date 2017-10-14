"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wishlist_controller_1 = require("./wishlist.controller");
var controller = new wishlist_controller_1.default();
var express = require('express');
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/my', auth.hasRole('user'), controller.my);
router.get('/', auth.hasRole('user'), controller.index);
router.get('/product/:pid/:vid', auth.hasRole('user'), controller.productWish);
router.get('/:id', controller.get);
router.post('/', auth.attachUserInfo(), controller.createOrRemove);
router.put('/:id', auth.hasRole('manager'), controller.update);
router.patch('/:id', auth.hasRole('manager'), controller.update);
router.delete('/:id', auth.hasRole('manager'), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map