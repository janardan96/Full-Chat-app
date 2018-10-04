const mongoose = require('mongoose');

const postSchema=mongoose.Schema({
    description:{
        type:String
    },
    image:String,
    author:{
        id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserDataBase"
        },
        userName:String,
        userProfilePic:String
    },
    userPost:String
});

module.exports = mongoose.model('Post', postSchema);