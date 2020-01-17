let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 24,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    role: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    fullname: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    registeredAt: {
        type: String,
        required: false,
    },
    avaUrl: {
        type: String,
        required: true
    },
    isDisabled: {
        type: Boolean,
        required: true
    },
    music: {
        type: Array,
        required: true
    },
    playlists: {
        type: Array,
        required: true
    },
    bio: {
        type: String,
        required: false
    }
});
let model = mongoose.model('users', userSchema);
module.exports = model;