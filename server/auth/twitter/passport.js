"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require('passport');
var passport_twitter_1 = require("passport-twitter");
function setup(User, config) {
    passport.use(new passport_twitter_1.Strategy({
        consumerKey: process.env.TWITTER_ID,
        consumerSecret: process.env.TWITTER_SECRET,
        callbackURL: (process.env.DOMAIN || '') + "/auth/twitter/callback"
    }, function (token, tokenSecret, profile, done) {
        profile._json.id = "" + profile._json.id;
        profile.id = "" + profile.id;
        User.findOne({ 'twitter.id': profile.id }).exec()
            .then(function (user) {
            if (user) {
                return done(null, user);
            }
            user = new User({
                name: profile.displayName,
                username: profile.username,
                avatar: profile.photos[0].value,
                role: 'user',
                provider: 'twitter',
                twitter: profile._json
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