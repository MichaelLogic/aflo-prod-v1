"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var user_model_1 = require("./user.model");
var base_1 = require("./../base");
var config_1 = require("../../config");
var async = require("async");
var crypto = require("crypto");
var _1 = require("../sendmail/");
var email = new _1.default();
var auth_service_1 = require("./../../auth/auth.service");
var auth = new auth_service_1.default();
var config = new config_1.default();
var UsersCtrl = (function (_super) {
    tslib_1.__extends(UsersCtrl, _super);
    function UsersCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = user_model_1.default;
        _this.validationError = function (res, statusCode) {
            statusCode = statusCode || 422;
            return function (err) {
                if (err.errors && err.errors.email.message) {
                    err = err.errors.email;
                }
                return res.status(statusCode).json(err);
            };
        };
        _this.handleError = function (res, statusCode) {
            statusCode = statusCode || 500;
            return function (err) {
                return res.status(statusCode).send(err);
            };
        };
        // Reset password route
        _this.reset = function (req, res, next) {
            console.log('reset');
            async.waterfall([
                function (done) {
                    user_model_1.default.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                        if (!user) {
                            return res.status(422).json({ 'message': 'Password reset email is invalid or has expired.' });
                        }
                        user.password = req.body.password;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        req.body.to = user.email;
                        user.save()
                            .then(function () {
                            email.send(config.resetPasswordEmail(req.body));
                            return res.status(200).json({ 'message': 'Success! Your password has been changed.' });
                        })
                            .catch(function (err) {
                            var statusCode = 422;
                            return function (err) {
                                if (err.errors && err.errors.email.message) {
                                    err = err.errors.email;
                                }
                                return res.status(statusCode).json(err);
                            };
                        });
                    });
                }
            ], function (err) {
                if (err)
                    return next(err);
            });
        };
        // Forgot password route
        _this.forgot = function (req, res, next) {
            async.waterfall([
                function (done) {
                    crypto.randomBytes(20, function (err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function (token, done) {
                    user_model_1.default.findOne({ email: req.body.email })
                        .then(function (user) {
                        if (!user) {
                            return res.status(422).json({ 'message': 'No account with that email address exists.' });
                        }
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                        user.save(function (err) {
                            done(err, token, user);
                        });
                    });
                },
                function (token, user, done) {
                    // req.body.headers =  req.headers
                    req.body.to = user.email;
                    req.body.host = req.headers.host;
                    req.body.token = token;
                    email.send(config.forgotPasswordEmail(req.body));
                    return res.status(200).json({ 'message': 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
                }
            ], function (err) {
                if (err)
                    return next(err);
            });
        };
        _this.getAll = function (req, res) {
            var q = {};
            var query = _this.toJson(req.query);
            if (query) {
                if (_this.toJson(query.where))
                    q = _this.toJson(query.where);
                var select = _this.toJson(query.select);
                var sort = query.sort;
                var skip = parseInt(query.skip);
                var limit = parseInt(query.limit);
            }
            return user_model_1.default.find(q, '-salt -password').limit(limit).skip(skip).sort(sort).select(select).exec()
                .then(function (users) {
                return res.status(200).json(users);
            })
                .catch(_this.handleError);
        };
        /**
         * Creates a new user
         */
        _this.create = function (req, res) {
            var newUser = new user_model_1.default(req.body);
            newUser.provider = 'local';
            var role = newUser.role || 'user';
            newUser.role = role;
            newUser.save()
                .then(function (user) {
                var token = auth_service_1.default.signToken(user);
                res.status(200).json({ token: token, user: { email: user.email, name: user.name, role: user.role, provider: user.provider, token: token } });
            })
                .catch(function (err) {
                if (err.errors && err.errors.email.message) {
                    err = err.errors.email.message;
                }
                res.status(422).json({ message: err });
            });
        };
        /**
         * Change a users password
         */
        _this.changePassword = function (req, res) {
            var userId = req.user._id;
            var oldPass = String(req.body.oldPassword);
            var newPass = String(req.body.newPassword);
            return user_model_1.default.findById(userId).exec()
                .then(function (user) {
                if (user.authenticate(oldPass)) {
                    user.password = newPass;
                    return user.save()
                        .then(function () {
                        return res.status(200).send({ message: 'Password changed successfully' });
                    })
                        .catch(_this.validationError);
                }
                else {
                    return res.status(403).send({ message: 'Incorrect old Password' });
                }
            });
        };
        /**
         * Get my info
         */
        _this.me = function (req, res, next) {
            var userId = req.user._id;
            return user_model_1.default.findOne({ _id: userId }, '-salt -password').exec()
                .then(function (user) {
                if (!user) {
                    return res.status(401).end();
                }
                return res.json(user);
            })
                .catch(function (err) { return next(err); });
        };
        /**
         * Authentication callback
         */
        _this.authCallback = function (req, res) {
            res.redirect('/');
        };
        return _this;
    }
    return UsersCtrl;
}(base_1.default));
exports.default = UsersCtrl;
//# sourceMappingURL=user.controller.js.map