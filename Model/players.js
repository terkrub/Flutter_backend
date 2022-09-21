const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DB = mongoose.connection.useDb('Players')

const playerSchema = new Schema({

    Code: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    Role:{
        type: Boolean,
    }
    
}, {timestamps: false})

const Players = DB.model("Players", playerSchema);


module.exports = Players;