var express = require('express');
const app = express();
const fs = require('fs-promise');
const path = require('path');
var router = express.Router();
const PL = require('../models/playlist');
const music = require('../models/music');
const cloudinary = require('cloudinary').v2;
const config = require('../config');
const user = require('../models/user');

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

router.get('/', function(req, res) {

    let max = 4;
    let requestedPage;
    if (req.query.page === undefined) {
        requestedPage = 0;
    } else {
        requestedPage = parseInt(req.query.page);
    }


    console.log(requestedPage);
    let pldata = [];
    PL.getAll()
        .then(item => {
            pldata = item;
            console.log(pldata);
            let PlData = {
                currPage: requestedPage,
                Playlists: pldata,
                nextPageVisibility: true,
                prevPageVisibility: true,
                nextPage: requestedPage + 1,
                prevPage: requestedPage - 1,
                isEmpty: false,
                searchBar: null,
                currentUser: req.user
            }

            let search = req.query.name;

            if (search === undefined) {
                PlData.searchBar = "";
            } else {
                PlData.searchBar = req.query.name;
            }

            let data = [];
            PlData.Playlists.forEach(playlist => {
                if (playlist.name.includes(PlData.searchBar))
                    data.push(playlist);
            });
            PlData.Playlists = data;
            console.log("playlist");
            console.log(PlData.Playlists);
            // console.log("~~~~~~~~~~~RESDATAEMPTY~~~~~~~~~~~~");
            // console.log(data);
            if ((requestedPage + 1) * (max) >= data.length) {
                PlData.nextPageVisibility = false;
            }

            if (requestedPage === 0) {
                PlData.prevPageVisibility = false;
            }

            if (PlData.Playlists.length == 0)
                PlData.isEmpty = true;

            let data1 = [];
            for (let i = requestedPage * max; i < (requestedPage + 1) * max && i < data.length; i++)
                data1.push(data[i]);
            PlData.Playlists = data1;
            if (PlData.currentUser != undefined)
                res.render('playlists', PlData);
            else
                res.render('denied');

            console.log("search by: ")
            console.log(PlData.searchBar + ".");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error 500: Internal server error.');
        });

});

// router.get('/music?name=123', function(req, res) {
//     // res.sendFile('index.html', { root: path.join(__dirname, '../views') });

//     // let itemsdata = {
//     //     items: music.getAll()
//     // }
//     let songname = req.body.name;
//     console.log(songname);
//     res.render('music', music.getAll());
// });

router.get('/new', function(req, res) {

    let songsdata = [];
    music.getAll()
        .then(item => {
            songsdata = item;
            let musicData = {
                Music: songsdata,
                currentUser: req.user
            }
            if (musicData.currentUser != undefined)
                res.render('playlists/new', musicData);
            else
                res.redirect('../error/denied');
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/:id/delete', function(req, res) {

    PL.deleteById(req.params.id)
        .then(data => {
            let delname = data.name;
            console.log("Deleted track " + delname);
            res.redirect('/playlists');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error 500 internal server error!');
        });
});

router.post('/new', function(req, res) {
    console.log("SELECTBOX ID'S: ");


    let ids = [];
    for (let par in req.body) {
        if (par.includes("element_4_")) {
            ids.push(req.body[par]);
        }
    }
    console.log(ids);
    let newpath = "./data/fs/";
    console.log(req.files)


    let file = req.files.element_3;
    let buf = file.data;

    new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ resource_type: "image" }, (error, result) => {
                    if (error)
                        reject(error)
                    else
                        resolve(result)
                })
                .end(buf)
        }).then((insertedFile) => {

            let date = new Date();
            let checked = (req.body.element_5_1 != undefined);
            if (checked)
                checked = 1;
            else
                checked = 0;
            // newObj = new PL('id', req.body.name, date.toISOString(), '', req.body.element_2, checked, 'http://localhost:3000/fs/' + req.files.element_4.name);
            newObj = new PL('1', req.body.name, date.toISOString(), ids, req.body.element_2, checked, insertedFile.url);

            return PL.insert(newObj);
        })
        .then((obj) => {
            let playlistss = [];
            for (let i = 0; i < req.user.playlists.length; i++)
                playlistss.push(req.user.playlists[i]);
            playlistss.push(obj._id.toString());
            newObj = new user(req.user._id, req.user.login, req.user.password, 0, req.user.fullname, req.user.registredAt, req.user.avaUrl, 0, req.user.music, playlistss, req.user.bio);
            user.update(newObj)
                .then(User => {
                    console.log(User);
                    res.redirect('../' + req.user._id);
                })
                .catch(err => {
                    console.log(err);
                });
            res.redirect('/playlists/' + obj._id);
        })
        .catch(err => {
            console.log(err);
        });

});

router.get('/:id', function(req, res) {

    PL.getById(req.params.id)
        .then((playlist, songs) => {
            let promises = [];
            playlist.songIds.forEach(id => {
                promises.push(music.getById(id))
            });
            Promise.all(promises)
                .then(songs => {

                    let songList = [];
                    for (i = 0; i < songs.length; i++) {
                        if (songs[i] !== null) {
                            songList.push(songs[i]);
                        }
                    }
                    console.log(songList)

                    let data = {
                        items: playlist,
                        Playlist: songList,
                        currentUser: req.user
                    }
                    console.log(data);
                    if (data.items != undefined && data.currentUser != undefined)
                        res.render('playlists/1', data);
                    else
                        res.redirect('/error/denied');
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error 500: Internal server error.');
        });

});




module.exports = router;