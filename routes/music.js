var express = require('express');
const app = express();
const fs = require('fs-promise');
const path = require('path');
var router = express.Router();
const music = require('../models/music');
const cloudinary = require('cloudinary').v2;
const config = require('../config');

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

// in request handler with file




router.get('/', function(req, res) {

    let max = 4;
    let requestedPage;
    if (req.query.page === undefined) {
        requestedPage = 0;
    } else {
        requestedPage = parseInt(req.query.page);
    }


    console.log(requestedPage);
    let songsdata = [];
    music.getAll()
        .then(item => {
            songsdata = item;
            console.log(songsdata);
            let musicData = {
                currPage: requestedPage,
                Music: songsdata,
                nextPageVisibility: true,
                prevPageVisibility: true,
                nextPage: requestedPage + 1,
                prevPage: requestedPage - 1,
                isEmpty: false,
                searchBar: null,
                currentUser: req.user,
                count: undefined
            }

            let search = req.query.name;

            if (search === undefined) {
                musicData.searchBar = "";
            } else {
                musicData.searchBar = req.query.name;
            }

            let data = [];
            musicData.Music.forEach(song => {
                if (song.name.includes(musicData.searchBar))
                    data.push(song);
            });
            musicData.Music = data;
            musicData.count = data.length.toString();
            console.log("music");
            console.log(musicData.Music);
            // console.log("~~~~~~~~~~~RESDATAEMPTY~~~~~~~~~~~~");
            // console.log(data);
            if ((requestedPage + 1) * (max) >= data.length) {
                musicData.nextPageVisibility = false;
            }

            if (requestedPage === 0) {
                musicData.prevPageVisibility = false;
            }

            if (musicData.Music.length == 0)
                musicData.isEmpty = true;

            let data1 = [];
            for (let i = requestedPage * max; i < (requestedPage + 1) * max && i < data.length; i++)
                data1.push(data[i]);
            musicData.Music = data1;
            if (musicData.currentUser != undefined) {
                res.render('music', musicData);
            } else {
                res.render('denied');
            }


            // console.log("search by: ")
            // console.log(musicData.searchBar + ".");
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
    // res.sendFile('index.html', { root: path.join(__dirname, '../views') });

    // let itemsdata = {
    //     items: music.getAll()
    // }
    let musicNew = {
        currentUser: req.user
    }
    if (musicNew.currentUser != undefined)
        res.render('music/new', musicNew);
    else {
        res.redirect('../error/denied');
    }
});

router.post('/:id/delete', function(req, res) {
    music.deleteById(req.params.id)
        .then(data => {
            let delname = data.name;
            console.log("Deleted track " + delname);
            res.redirect('/music');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error 500 internal server error!');
        });
});

router.post('/new', function(req, res) {
    let file1 = req.files.element_4;
    let buf1 = file1.data;
    let promises = [];
    promises.push(new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ resource_type: "video" }, (error, result) => {
                if (error)
                    reject(error)
                else
                    resolve(result)
            })
            .end(buf1)
    }))



    let file = req.files.element_3;
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

            console.log("test");
            let date = new Date();
            let checked = (req.body.element_5_1 != undefined);
            if (checked)
                checked = 1;
            else
                checked = 0;
            newObj = new music('id', req.body.name, date.toISOString(), insertedFiles[1].url, req.body.element_2, insertedFiles[0].url, checked, req.user._id.toString());
            return music.insert(newObj);
        })
        .then((obj) => {
            res.redirect('/music/' + obj._id);
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/:id', function(req, res) {

    music.getById(req.params.id)
        .then(song => {
            let data = {
                items: song,
                rightUser: false,
                currentUser: req.user
            }
            console.log(data);
            if (data.items != undefined && data.currentUser != undefined) {
                if (req.user._id.toString() == data.items.createdBy.toString()) { data.rightUser = true }
                res.render('music/1', data);
            } else
                res.redirect('/error/denied');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error 500: Internal server error.');
        });

});

router.post('/:id/edit', function(req, res) {

    music.getById(req.params.id)
        .then(mus => {
            let promises = [];
            let file = req.files.image;
            if (file != undefined) {
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
                        newObj = new music(mus._id, req.body.name, mus.timeAdded, insertedFiles[0].url, req.body.desc, mus.code, mus.isDisabled, mus.createdBy);
                        console.log("obj", newObj);
                        music.update(newObj)
                            .then(Music => {
                                res.redirect('../' + Music._id);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
            } else {
                newObj = new music(mus._id, req.body.name, mus.timeAdded, mus.songUrl, req.body.desc, mus.code, mus.isDisabled, mus.createdBy);
                console.log("obj", newObj);
                music.update(newObj)
                    .then(Music => {
                        res.redirect('../' + Music._id);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/:id/edit', function(req, res) {
    console.log("DESCRIPT", req.body.desc);
    music.getById(req.params.id)
        .then(song => {
            let data = {
                items: song,
                rightUser: false,
                currentUser: req.user
            }
            console.log(data);
            if (data.items != undefined && data.currentUser != undefined) {
                if (req.user._id.toString() == data.items.createdBy.toString()) { data.rightUser = true }
                res.render('music/edit', data);
            } else
                res.redirect('/error/denied');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error 500: Internal server error.');
        });

});





module.exports = router;