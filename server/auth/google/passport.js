"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require('passport');
var passport_google_oauth20_1 = require("passport-google-oauth20");
function setup(User, config) {
    passport.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: (process.env.DOMAIN || '') + "/auth/google/callback"
    }, function (accessToken, refreshToken, profile, done) {
        User.findOne({ 'google.id': profile.id }).exec()
            .then(function (user) {
            if (user) {
                return done(null, user);
            }
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                role: 'user',
                username: profile.emails[0].value.split('@')[0],
                avatar: profile.photos[0].value,
                provider: 'google',
                google: profile._json
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