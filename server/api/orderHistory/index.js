"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var controller = require('./orderHistory.controller');
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/', controller.index);
router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/:id', controller.get);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map