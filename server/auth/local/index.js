"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var passport = require('passport');
var auth_service_1 = require("../auth.service");
var router = express.Router();
router.post('/', function (req, res, next) {
    console.log("AUTH LOCAL: ", next);
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) {
            return res.status(401).json(error);
        }
        if (!user) {
            return res.status(404).json({ message: 'Something went wrong, please try again.' });
        }
        var token = auth_service_1.default.signToken(user);
        user.token = token;
        res.status(200).json({ token: token, user: user });
    })(req, res, next);
});
module.exports = router;
//# sourceMappingURL=index.js.map