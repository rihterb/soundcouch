module.exports = {};
const fs = require('fs');
let file = './data/music.json';
const music = require('../schemes/music');
// let raw = fs.readFileSync('./data/music.json');
// var music = JSON.parse(raw);

class Music {


    constructor(id, name, timeAdded, songUrl, yearPublished, code, isDisabled, createdBy) {
        this.id = id; // number
        this.name = name; // string
        this.timeAdded = timeAdded; // ISO 8601
        this.songUrl = songUrl; // string
        this.yearPublished = yearPublished; // number
        this.code = code; // some kind of a universal song code like 
        this.isDisabled = isDisabled; // number
        this.createdBy = createdBy;
    }


    static insert(x) {
        return music(x).save()
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
        return music.find({});
    }

    static getById(id) {
        return music.findById(id);

    }

    static deleteById(id) {
        return music.findByIdAndDelete(id);
    }

    static update(x) {
        return music.findOneAndUpdate({ _id: x.id }, { name: x.name, timeAdded: x.timeAdded, songUrl: x.songUrl, yearPublished: x.yearPublished, code: x.code, isDisabled: x.isDisabled, createdBy: x.createdBy });
    }
};

module.exports = Music;