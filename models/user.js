const fs = require('fs');
const users = require('../schemes/users');

class User {


    constructor(id, login, password, role, fullname, registredAt, avaUrl, isDisabled, music, playlists, bio) {
        this.id = id; // number
        this.login = login; // string
        this.role = role; // number 0 - regular, 1 - admin
        this.fullname = fullname; // string
        this.registredAt = registredAt; // string ISO 8601
        this.avaUrl = avaUrl;
        this.isDisabled = isDisabled;
        this.password = password;
        this.music = music;
        this.playlists = playlists;
        this.bio = bio;
    }


    static getAll() {
        return users.find({});
    }

    static getById(id) {
        return users.findById(id);
    }
    static findOne(x) {
        return users.findOne({ login: x });
    }

    static insert(x) {
        return users(x).save()
    }

    static update(x) {
        return users.findOneAndUpdate({ _id: x.id }, { login: x.login, password: x.password, role: x.role, fullname: x.fullname, avaUrl: x.avaUrl, music: x.music, playlists: x.playlists, bio: x.bio });
    }



};

module.exports = User;