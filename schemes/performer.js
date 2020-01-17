let mongoose = require('mongoose');

let performerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    songs: {
        type: Array,
        required: false
    }
});
let model = mongoose.model('performer', performerSchema);
module.exports = model;