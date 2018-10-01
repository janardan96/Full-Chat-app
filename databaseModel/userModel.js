const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const Post=require('./post')

const userSchema = mongoose.Schema({
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: ''
    },
    userImage: {
        type: String,
        default:"/images/defaultImage.jpg"
    },
    birthdate: {
        type: String,
        trim: true
    },
    facebook: { 
        type: String,
        default: ""
    },
    ageRange:Object,
    gender: {
        type: String,
        trim: true,
        default:""
    },
    fbTokens: Array,
    googel: {
        type: String,
        default: ""
    },
    location:{
        type:String,
        default:"Delhi"
    }
});

userSchema.methods.encryptPassword =(password)=>{
    return bcrypt.hashSync(password,10,null);
};

userSchema.methods.validUserPassword =function(password){
    return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('UserDataBase', userSchema);