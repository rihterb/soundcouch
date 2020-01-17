module.exports = {};
const fs = require('fs');
let file = './data/music.json';
const pl = require('../schemes/playlist');
// let raw = fs.readFileSync('./data/music.json');
// var music = JSON.parse(raw);

class Playlist {


    constructor(id, name, timeAdded, songIds, description, isDisabled, coverUrl) {
        this.id = id; // number
        this.name = name; // string
        this.timeAdded = timeAdded; // ISO 8601
        this.songIds = songIds; // string
        this.description = description; // number
        this.isDisabled = isDisabled; // number
        this.coverUrl = coverUrl;
    }


    static insert(x) {
        return pl(x).save()
    }




    // returns music with id or undefined
    // static getById(id) {
    //     for (let Music of music.items) {
    //         if (Music.id === id) {
    //             return Music;
    //         }
    //     }
    // }

    // static getLast() {
    //     for (let Music of music.items) {
    //         if (Music.id === (music.nextId - 1)) {
    //             return Music;
    //         }
    //     }
    // }

    // returns an array of all users in storage
    static getAll() {
        return pl.find({});
    }

    static getById(id) {
        return pl.findById(id);

    }

    static deleteById(id) {
        return pl.findByIdAndDelete(id);
    }
};

module.exports = Playlist;