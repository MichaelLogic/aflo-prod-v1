"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var address_controller_1 = require("./address.controller");
var controller = new address_controller_1.default();
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var express = require('express');
var router = express.Router();
router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map