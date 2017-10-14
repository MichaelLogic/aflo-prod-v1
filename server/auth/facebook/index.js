"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var passport = require('passport');
var auth_service_1 = require("../auth.service");
var router = express.Router();
router
    .get('/', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signup',
    session: false
}))
    .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup',
    session: false
}), auth_service_1.default.setTokenCookie);
exports.default = router;
//# sourceMappingURL=index.js.map