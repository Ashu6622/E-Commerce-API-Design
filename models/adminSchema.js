const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
    unique: [true, "email already exit"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role:{
    type:"String",
    default:"admin"
  }
},{
  timestamps:true
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
