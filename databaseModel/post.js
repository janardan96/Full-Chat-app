const mongoose = require('mongoose');

const postSchema=mongoose.Schema({
    description:{
        type:String,
    },
    image:String
});

module.exports = mongoose.model('Post', postSchema);