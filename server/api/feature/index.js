"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var feature_controller_1 = require("./feature.controller");
var controller = new feature_controller_1.default();
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/', controller.index);
router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/group', controller.group);
router.get('/:id', controller.get);
router.post('/', auth.hasRole('manager'), controller.create);
router.put('/:id', auth.hasRole('manager'), controller.update);
router.patch('/:id', auth.hasRole('manager'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map