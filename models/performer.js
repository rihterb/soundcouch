module.exports = {};
const perf = require('../schemes/performer');


class Performer {


    constructor(id, name, songs) {
        this.id = id; // number
        this.name = name; // string
        this.songs = songs; // array
    }


    static insert(x) {
        return perf(x).save()
    }

    static getAll() {
        return perf.find({});
    }

    static getById(id) {
        return perf.findById(id);

    }

    static deleteById(id) {
        return perf.findByIdAndDelete(id);
    }
};

module.exports = Performer;