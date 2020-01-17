var express = require('express');
const app = express();
const path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
    // res.sendFile('index.html', { root: path.join(__dirname, '../views') });
    res.render('index', { currentUser: req.user });
});


module.exports = router;