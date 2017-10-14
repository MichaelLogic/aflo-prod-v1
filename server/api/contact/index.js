"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var contact_controller_1 = require("./contact.controller");
var controller = new contact_controller_1.default();
var express = require('express');
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/my', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map