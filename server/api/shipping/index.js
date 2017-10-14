"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shipping_controller_1 = require("./shipping.controller");
var controller = new shipping_controller_1.default();
var express = require('express');
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/', controller.index);
router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/best', controller.best);
router.get('/:id', controller.get);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map