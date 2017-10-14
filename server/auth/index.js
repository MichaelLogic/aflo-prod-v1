"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var user_model_1 = require("../api/user/user.model");
// Passport Configuration
require('./local/passport').setup(user_model_1.default);
require('./facebook/passport').setup(user_model_1.default);
require('./google/passport').setup(user_model_1.default);
require('./twitter/passport').setup(user_model_1.default);
var router = express.Router();
router.use('/local', require('./local'));
router.use('/facebook', require('./facebook').default);
router.use('/twitter', require('./twitter').default);
router.use('/google', require('./google').default);
module.exports = router;
//# sourceMappingURL=index.js.map