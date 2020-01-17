var express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const document = require('document');
const user = require('../models/user');
const bcrypt = require('bcrypt');
var router = express.Router();

const saltRounds = 10;

router.get('/', function(req, res) {
    let currentUser = req.user;
    if (currentUser != undefined)
        req.logout();
    res.redirect('auth/login');
});

router.get('/login', function(req, res) {
    let currentUser = req.user;
    if (currentUser != undefined)
        req.logout();
    res.render('login');
});

router.post('/login/fetch', passport.authenticate('local', ), function(req, res) {
    console.log(req.body);
    console.log(req.query);
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401);
    }
});

// router.post('/login',
//     // passport.authenticate('local', ),
//     // (req, res) => res.redirect('/users/' + req.user._id)
//     passport.authenticate('local', {
//         successRedirect: '/users',
//         failureRedirect: '/auth/login'
//     })
// );

router.get('/register', function(req, res) {
    let currentUser = req.user;
    if (currentUser != undefined)
        req.logout();
    res.render('register');
});


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('login');
});

router.post('/register', function(req, res) {
    user.getAll()
        .then(users => {
            let myPlaintextPassword = req.body.pass;
            let check = 0;
            let userData = {
                currentUser: req.user,
                items: users
            }
            console.log(userData.items);
            for (i = 0; i < userData.items.length; i++) {
                if (req.body.login == userData.items[i].login) {
                    check = 1;
                }
            }
            if (check == 0) {
                if (req.body.repass === req.body.pass) {
                    bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
                        let date = new Date();
                        newObj = new user('id', req.body.login, hash, 0, req.body.login, date.toISOString(), "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png", 0);
                        user.insert(newObj)
                            .then((obj) => {
                                res.redirect('login');
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
                } else {
                    console.log("passwords don't match");
                }
            } else {
                console.log('error: user already exist');
                res.redirect('../error');
            }

        })
        .catch(err => {
            console.log(err);
            res.redirect('../error');
        });

});


module.exports = router