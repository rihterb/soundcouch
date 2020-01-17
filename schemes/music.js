let mongoose = require('mongoose');

let musicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    timeAdded: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    songUrl: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 99999999
    },
    yearPublished: {
        type: String,
        minlength: 1,
        maxlength: 250
    },
    code: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 999999999
    },
    isDisabled: {
        type: Number,
        minlength: 1,
        maxlength: 1,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
});
let model = mongoose.model('music', musicSchema);
module.exports = model;