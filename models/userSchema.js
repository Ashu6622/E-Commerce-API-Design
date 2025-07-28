const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        minlength:3,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        unique:[true,"email already exit"],
    },
    password:{
        type:String,
        required:true,
        minlength:5,
    },
    phone:{
        type:String,
        required:true,
        minlength:10,
        maxlength:10,
        unique:true
    },
    role:{
        type:String,
        default:"customer"
    }
},
{
    timestamps:true
})
const User = mongoose.model('user', userSchema);

module.exports = User