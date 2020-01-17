var express = require('express');
const app = express();
const path = require('path');
const music = require('../models/music')
const user = require('../models/user')
var router = express.Router();


router.get('/users', function(req, res) {
    user.getAll()
        .then(raw => {
            let i = 0;

            for (i in raw) {
                let login = "";
                // let id = 0;
                let name = "";
                let role = 0;
                let roleString = "";
                login = raw[i].login;
                id = raw[i].id;
                name = raw.fullname;
                role = raw.role;
                if (role == 1) {
                    roleString = "Admin";
                } else {
                    roleString = "User";
                }
                //console.log("\n" + "Id: " + id + "\n" + "Login: " + login + "\n" + "Fullname: " + name + "\n" + "Role: " + roleString + "\n");
                // res.send('index', { title: login });

            }
            console.log("Loaded API/USERS with", ++i, "documents");
            res.json(raw);
        })
        .catch(err => {
            console.log(err);
        })

});

router.get('/users/fetch', function(req, res) {
    user.getAll()
        .then(raw => {
            res.json(raw);
            return raw;
        })
        .catch(err => {
            console.log(err, "fuck");
        });
});

router.get('/users/:id', function(req, res) {
    raw = user.getById(parseInt(req.params.id));
    if (raw == undefined) {
        res.sendStatus(404);
    } else {
        let login = "";
        // let id = 0;
        let name = "";
        let role = 0;
        let roleString = "";
        login = raw.login;
        id = raw.id;
        name = raw.fullname;
        role = raw.role;
        if (role == 1) {
            roleString = "Admin";
        } else {
            roleString = "User";
        }
        console.log("\n" + "Id: " + id + "\n" + "Login: " + login + "\n" + "Fullname: " + name + "\n" + "Role: " + roleString + "\n");
        // res.send('index', { title: login });
        res.json(raw);
    }
});

router.get('/music/:id', function(req, res) {
    console.log("SEARCH RESULT BY ID " + req.params.id);
    raw = music.getById(parseInt(req.params.id));
    if (raw == undefined) {
        res.sendStatus(404);
    } else {
        let year = 0;
        let id = 0;
        let songUrl = "";
        let name = "";
        let timeAdded = "";
        let code = 0;
        year = raw.yearPublished;
        id = raw.id;
        songUrl = raw.songUrl;
        name = raw.name;
        timeAdded = raw.timeAdded;
        code = raw.code;
        console.log("Id: " + id + "\n" + "Name: " + name + "\n" + "Year: " + year + "\n" + "Code: " + code + "\n" + "Song Url: " + songUrl + "\n" + "Time Added: " + timeAdded + "\n");
        res.json(raw);
    }
});

router.get('/music', function(req, res) {
    console.log("MUSIC LIST");
    let raw = music.getAll();
    let i = 0;
    for (i in raw.items) {
        let year = 0;
        let id = 0;
        let songUrl = "";
        let name = "";
        let timeAdded = "";
        let code = 0;
        year = raw.items[i].yearPublished;
        id = raw.items[i].id;
        songUrl = raw.items[i].songUrl;
        name = raw.items[i].name;
        timeAdded = raw.items[i].timeAdded;
        code = raw.items[i].code;
        console.log("\n" + "Id: " + id + "\n" + "Name: " + name + "\n" + "Year: " + year + "\n" + "Code: " + code + "\n" + "Song Url: " + songUrl + "\n" + "Time Added: " + timeAdded + "\n");
        res.json(raw);
    }
});



module.exports = router;