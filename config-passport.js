const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.getById(id)
        .then(user => { done(null, user); })
        .catch(err => { done(err, null); });
});

passport.use(new LocalStrategy(
    function(login, password, done) {
        User.findOne(login)
            .then((user) => {
                if (!user) {
                    console.log('incorrect login')
                    return done(null, false, { message: 'Incorrect login.' });
                }
                bcrypt.compare(password, user.password, function(err, res) {
                    if (res == true) {
                        console.log('password correct')
                        return done(null, user);
                    }
                    if (res == false) {
                        console.log('incorrect pass')
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    // return done(null, user);
                })
            })
            .catch(err => {
                return done(err, null);
            });
    }
));