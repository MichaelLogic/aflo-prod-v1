"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var customer_controller_1 = require("./customer.controller");
var controller = new customer_controller_1.default();
var express = require('express');
var router = express.Router();
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
router.get('/', controller.index);
router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/:id', controller.get);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map