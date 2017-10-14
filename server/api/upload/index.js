"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = require("./controller");
var controller = new controller_1.default();
var express = require('express');
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/', controller.index); // Assigned but not accepted or rejected
router.get('/my', auth.isAuthenticated(), controller.index); // Assigned but not accepted or rejected
router.get('/:id', auth.isAuthenticated(), controller.get);
router.post('/', auth.hasRole('user'), controller.create);
router.patch('/:id', auth.hasRole('user'), auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map