var express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
var router = express.Router();
const music = require('../models/music');

router.get('/', function(req, res) {
    res.render('error', { currentUser: req.user });
});
router.get('/denied', function(req, res) {
    res.render('denied', { currentUser: req.user });
});


module.exports = router;