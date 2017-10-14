"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var controller = require('./payment-method.controller');
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/', controller.index);
router.get('/my', controller.my);
router.get('/active', auth.isAuthenticated(), controller.get);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map