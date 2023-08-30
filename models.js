const mongoose = require("mongoose");

const textSchema = new mongoose.Schema({
    text: {
        type: String,
        required:true,
    },
    pass: {
        type: String,
        required:true,
    },
    emoji: {
        type: String
    }

})

module.exports = mongoose.model('texts', textSchema);
