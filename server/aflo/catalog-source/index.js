"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var catalog_source_controller_1 = require("./catalog-source.controller");
var controller = new catalog_source_controller_1.default();
var auth_service_1 = require("../../auth/auth.service");
var auth = new auth_service_1.default();
var router = express.Router();
router.get('/', controller.getAll);
router.get('/:id', controller.get);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.patch);
router.patch('/:id', auth.hasRole('admin'), controller.patch);
router.delete('/:id', auth.hasRole('admin'), controller.delete);
module.exports = router;
//# sourceMappingURL=index.js.map