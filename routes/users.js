var express = require('express');
const app = express();
const path = require('path');
var router = express.Router();
const user = require('../models/user');
const PL = require('../models/playlist');
const cloudinary = require('cloudinary').v2;
const config = require('../config');

// router.get('/', function(req, res) {
//     users.getAll(function(err, item) {
//         console.log(item);
//         if (!err) {
//             let userData = {
//                 items: item
//             }
//             res.render('users', userData);
//         } else {
//             console.log(err);
//             res.status(500).send('Error 500: Internal server error.');
//         }
//     })
// });

router.get('/', function(req, res) {
    user.getAll()
        .then(users => {
            let userData = {
                currentUser: req.user,
                items: users
            }
            if (userData.currentUser != undefined)
                res.render('users', userData);
            else
                res.render('denied');
        })
        .catch(err => {
            res.render('error');
        });
});

router.post('/:id/edit', function(req, res) {
    let promises = [];
    let file = req.files.image;
    let buf = file.data;
    promises.push(new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
                if (error)
                    reject(error)
                else
                    resolve(result)
            })
            .end(buf)
    }))
    Promise.all(promises)
        .then((insertedFiles) => {
            newObj = new user(req.user._id, req.user.login, req.user.password, 0, req.body.fullname, req.user.registredAt, insertedFiles[0].url, 0, req.user.music, req.user.playlists, req.body.bio);
            console.log("obj", newObj);
            user.update(newObj)
                .then(User => {
                    console.log(User);
                    res.redirect('../' + req.user._id);
                })
                .catch(err => {
                    console.log(err);
                });
        });
});

router.get('/:id/edit', function(req, res) {
    user.getById(req.params.id)
        .then(user => {
            let promises = [];
            user.playlists.forEach(id => {
                promises.push(PL.getById(id))
            });
            Promise.all(promises)
                .then(playlists => {
                    let playLists = [];
                    for (i = 0; i < playlists.length; i++) {
                        if (playlists[i] !== null) {
                            playLists.push(playlists[i]);
                        }
                    }
                    console.log(playLists)
                    let userData = {
                        items: user,
                        currentUser: req.user,
                        Playlists: playLists,
                        rightUser: false
                    }


                    if (userData.currentUser != undefined) {
                        if (req.user._id.toString() == userData.items._id.toString()) { userData.rightUser = true }
                        res.render("users/edit", userData);
                    } else
                        res.redirect('../../error/denied');
                })
                .catch(err => {
                    console.log(err);
                });


        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error 500 internal server error');
        });
});

router.get('/:id', function(req, res) {
    user.getById(req.params.id)
        .then(user => {
            let promises = [];
            user.playlists.forEach(id => {
                promises.push(PL.getById(id))
            });
            Promise.all(promises)
                .then(playlists => {
                    let playLists = [];
                    for (i = 0; i < playlists.length; i++) {
                        if (playlists[i] !== null) {
                            playLists.push(playlists[i]);
                        }
                    }
                    console.log(playLists)
                    let userData = {
                        items: user,
                        currentUser: req.user,
                        Playlists: playLists,
                        rightUser: false
                    }


                    if (userData.currentUser != undefined) {
                        if (req.user._id.toString() == userData.items._id.toString()) { userData.rightUser = true }
                        res.render("users/1", userData);
                    } else
                        res.render('denied');
                })
                .catch(err => {
                    console.log(err);
                });


        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error 500 internal server error');
        });

    // PL.getById(req.params.id)
    // .then((playlist, songs) => {
    //     let promises = [];
    //     playlist.songIds.forEach(id => {
    //         promises.push(music.getById(id))
    //     });
    //     Promise.all(promises)
    //         .then(songs => {
    //             let data = {
    //                 items: playlist,
    //                 Playlist: songs
    //             }
    //             console.log(data);
    //             if (data.items != undefined)
    //                 res.render('playlists/1', data);
    //             else
    //                 res.redirect('http://localhost:3000/error');
    //         });
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.status(500).send('Error 500: Internal server error.');
    // });
});


module.exports = router;