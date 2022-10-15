const mongoose = require('mongoose'), Admin = mongoose.mongo.Admin;
const Schema = mongoose.Schema;

const DB = mongoose.connection.useDb('Rooms')

const roomSchema = new Schema({

    Code: {
        type: String,
        required: true
    },
    MaxSeeker: {
        type: Number,
        required: true
    },
    MaxHider:{
        type: Number,
        required: true
    },
    Boundary:{
        type: Object,
        require: true
    }
    
}, {timestamps: false})


const Rooms = DB.model("AllRoom", roomSchema);


module.exports = Rooms;