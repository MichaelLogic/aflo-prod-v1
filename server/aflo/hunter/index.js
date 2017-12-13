"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var hunter_controller_1 = require("./hunter.controller");
var controller = new hunter_controller_1.default();
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/:id', auth.hasRole('admin'), controller.huntForGoods);
module.exports = router;
//# sourceMappingURL=index.js.map