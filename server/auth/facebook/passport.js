"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require('passport');
var passport_facebook_1 = require("passport-facebook");
function setup(User, config) {
    passport.use(new passport_facebook_1.Strategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: (process.env.DOMAIN || '') + "/auth/facebook/callback",
        profileFields: [
            'displayName',
            'emails',
            'photos'
        ]
    }, function (accessToken, refreshToken, profile, done) {
        User.findOne({ 'facebook.id': profile.id }).exec()
            .then(function (user) {
            if (user) {
                return done(null, user);
            }
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
                role: 'user',
                provider: 'facebook',
                facebook: profile._json
            });
            user.save()
                .then(function (savedUser) { return done(null, savedUser); })
                .catch(function (err) { return done(err); });
        })
            .catch(function (err) { return done(err); });
    }));
}
exports.setup = setup;
//# sourceMappingURL=passport.js.map