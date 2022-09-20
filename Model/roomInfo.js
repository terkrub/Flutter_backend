const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    Hider: {
        type: String
    },
    Seeker: {
        type: String,
    },
}, {timestamps: true})

const Rooms = mongoose.model('Rooms', roomSchema);
module.exports = Rooms;