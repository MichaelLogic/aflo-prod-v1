"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var product_controller_1 = require("./product.controller");
var controller = new product_controller_1.default();
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/', controller.getAll);
// router.get('/search', controller.search);
router.get('/my', auth.hasRole('vendor'), controller.my);
router.get('/count', controller.count);
router.get('/priceRange', controller.priceRange);
router.get('/:id', controller.get);
router.get('/deep/:id', controller.showDeep);
// router.get('/best-sellers', controller.bestSellers);
router.post('/', auth.hasRole('vendor'), controller.create);
router.put('/:id', auth.hasRole('vendor'), controller.patch);
router.patch('/:id', auth.hasRole('vendor'), controller.patch);
router.delete('/:id', auth.hasRole('vendor'), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map