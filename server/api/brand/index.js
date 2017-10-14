"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var brand_controller_1 = require("./brand.controller");
var controller = new brand_controller_1.default();
var express = require('express');
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/', controller.index);
router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/:id', controller.get);
router.post('/', auth.hasRole('manager'), controller.create);
router.put('/:id', auth.hasRole('manager'), controller.update);
router.patch('/:id', auth.hasRole('manager'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map