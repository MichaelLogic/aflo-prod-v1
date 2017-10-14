"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var mongoose_1 = require("mongoose");
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var UserSchema = new mongoose_1.Schema({
    name: String,
    email: {
        type: String,
        lowercase: true,
        required: function () {
            if (authTypes.indexOf(this.provider) === -1) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: function () {
            if (authTypes.indexOf(this.provider) === -1) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    avatar: String,
    resetPasswordToken: String,
    resetPasswordExpires: String,
    provider: String,
    salt: String,
    facebook: {},
    twitter: {},
    google: {},
    github: {},
    assigned: String,
    active: { type: Boolean, default: true },
    address: String,
    carrierCode: String
});
/**
 * Virtuals
 */
// Public profile information
UserSchema
    .virtual('profile')
    .get(function () {
    return {
        name: this.name,
        role: this.role
    };
});
// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function () {
    return {
        _id: this._id,
        role: this.role
    };
});
/**
 * Validations
 */
// Validate empty email
UserSchema
    .path('email')
    .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return email.length;
}, 'Email cannot be blank');
// Validate empty password
UserSchema
    .path('password')
    .validate(function (password) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return password.length;
}, 'Password cannot be blank');
// Validate email is not taken
UserSchema
    .path('email')
    .validate(function (value, respond) {
    var _this = this;
    if (authTypes.indexOf(this.provider) !== -1) {
        return respond(true);
    }
    return this.constructor.findOne({ email: value }).exec()
        .then(function (user) {
        if (user) {
            if (_this.id === user.id) {
                return respond(true);
            }
            return respond(false);
        }
        return respond(true);
    })
        .catch(function (err) {
        throw err;
    });
}, 'The specified email address is already in use.');
var validatePresenceOf = function (value) {
    return value && value.length;
};
/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function (next) {
    var _this = this;
    // Handle new/update passwords
    if (!this.isModified('password')) {
        return next();
    }
    if (!validatePresenceOf(this.password)) {
        if (authTypes.indexOf(this.provider) === -1) {
            return next(new Error('Invalid password'));
        }
        else {
            return next();
        }
    }
    // Make salt with a callback
    this.makeSalt(function (saltErr, salt) {
        if (saltErr) {
            return next(saltErr);
        }
        _this.salt = salt;
        _this.encryptPassword(_this.password, function (encryptErr, hashedPassword) {
            if (encryptErr) {
                return next(encryptErr);
            }
            _this.password = hashedPassword;
            return next();
        });
    });
});
UserSchema.methods = {
    authenticate: function (password, callback) {
        var _this = this;
        if (!callback) {
            return this.password === this.encryptPassword(password);
        }
        this.encryptPassword(password, function (err, pwdGen) {
            if (err) {
                return callback(err);
            }
            if (_this.password === pwdGen) {
                return callback(null, true);
            }
            else {
                return callback(null, false);
            }
        });
    },
    makeSalt: function (byteSize, callback) {
        var defaultByteSize = 16;
        if (typeof arguments[0] === 'function') {
            callback = arguments[0];
            byteSize = defaultByteSize;
        }
        else if (typeof arguments[1] === 'function') {
            callback = arguments[1];
        }
        else {
            throw new Error('Missing Callback');
        }
        if (!byteSize) {
            byteSize = defaultByteSize;
        }
        return crypto.randomBytes(byteSize, function (err, salt) {
            if (err) {
                return callback(err);
            }
            else {
                return callback(null, salt.toString('base64'));
            }
        });
    },
    encryptPassword: function (password, callback) {
        if (!password || !this.salt) {
            if (!callback) {
                return null;
            }
            else {
                return callback('Missing password or salt');
            }
        }
        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');
        if (!callback) {
            return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha512')
                .toString('base64');
        }
        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha512', function (err, key) {
            if (err) {
                return callback(err);
            }
            else {
                return callback(null, key.toString('base64'));
            }
        });
    }
};
exports.default = mongoose.model('User', UserSchema);
//# sourceMappingURL=user.model.js.map