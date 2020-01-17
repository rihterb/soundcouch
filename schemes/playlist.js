let mongoose = require('mongoose');

let plSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 150
    },
    timeAdded: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    songIds: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        minlength: 1,
        maxlength: 250
    },
    isDisabled: {
        type: Number,
        minlength: 1,
        maxlength: 1,
        required: true
    },
    coverUrl: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 9999
    }
});
let model = mongoose.model('playlist', plSchema);
module.exports = model;