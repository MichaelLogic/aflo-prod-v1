"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("./../config");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
var compose = require("composable-middleware");
var user_model_1 = require("../api/user/user.model");
var base_1 = require("./../api/base");
var _ = require("lodash");
var config = new config_1.default();
var dotenv = require("dotenv");
dotenv.load({ path: '.env' });
var validateJwt = expressJwt({
    secret: process.env.SESSION_SECRET
});
var jwtUserInfo = expressJwt({
    secret: process.env.SESSION_SECRET,
    credentialsRequired: false
});
var AuthService = (function (_super) {
    tslib_1.__extends(AuthService, _super);
    function AuthService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = user_model_1.default;
        /**
         * Attaches the user object to the request if authenticated
         * Otherwise returns 403
         */
        _this.isAuthenticated = function () {
            return compose()
                .use(function (req, res, next) {
                // allow token to be passed through query parameter as well
                if (req.query && req.query.hasOwnProperty('token')) {
                    req.headers.authorization = "Bearer " + req.query.token;
                }
                // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
                if (req.query && typeof req.headers.authorization === 'undefined') {
                    req.headers.authorization = "Bearer " + req.cookies.token;
                }
                validateJwt(req, res, next);
            })
                .use(function (req, res, next) {
                user_model_1.default.findById(req.user._id).exec()
                    .then(function (user) {
                    if (!user) {
                        return res.status(401).end();
                    }
                    req.user = user;
                    next();
                    return null;
                })
                    .catch(function (err) { return next(err); });
            });
        };
        /**
         * Attaches the user object to the request if authenticated
         * Otherwise blank
         */
        _this.attachUserInfo = function () {
            return compose()
                .use(function (req, res, next) {
                jwtUserInfo(req, res, next);
            })
                .use(function (req, res, next) {
                if (req.user) {
                    user_model_1.default.findById(req.user._id).exec()
                        .then(function (user) {
                        if (!user) {
                            return res.status(401).end();
                        }
                        req.user = user;
                        next();
                        return null;
                    })
                        .catch(function (err) { return next(err); });
                }
                else {
                    next();
                }
            });
        };
        /**
         * Checks if the user role meets the minimum requirements of the route
         */
        _this.hasRole = function (roleRequired) {
            if (!roleRequired) {
                throw new Error('Required role needs to be set');
            }
            return compose()
                .use(_this.isAuthenticated())
                .use(function meetsRequirements(req, res, next) {
                if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                    // if (config.userRoles.indexOf(roleRequired) >= 0) {
                    return next();
                }
                else {
                    return res.status(403).send('Forbidden');
                }
            });
        };
        /**
         * Checks if the user role meets the minimum requirements of the route
         */
        _this.hasRoles = function (roleRequired) {
            if (!roleRequired) {
                throw new Error('Required role needs to be set');
            }
            return compose()
                .use(_this.isAuthenticated())
                .use(function meetsRequirements(req, res, next) {
                var authorized = false;
                _.each(roleRequired, function (role) {
                    authorized = config.userRoles.indexOf(req.user.role) === config.userRoles.indexOf(role) || authorized;
                });
                if (authorized) {
                    return next();
                }
                else {
                    return res.status(403).send('Forbidden');
                }
            });
        };
        return _this;
    }
    return AuthService;
}(base_1.default));
/**
 * Returns a jwt token signed by the app secret
 */
AuthService.signToken = function (user) {
    return jwt.sign({ _id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar }, process.env.SESSION_SECRET, {
        expiresIn: 60 * 60 * 24 * 7
    });
};
/**
 * Set token cookie directly for oAuth strategies
 */
AuthService.setTokenCookie = function (req, res) {
    if (!req.user) {
        return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }
    var token = AuthService.signToken(req.user);
    res.cookie('token', token);
    res.redirect('/');
};
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map