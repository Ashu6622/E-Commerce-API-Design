const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({

   name:{
    type:String,
    required:true,
    unique:true,
    trim: true,
   },
   rating:{
    type:Number,
    min: 1,
    max: 5,
    default:1
   },
    count:{
      type:Number,
      default:0
    },
     total_rating:{
      type:Number,
      default:0,
    }

},{
    timestamps:true
})

const subCategory = mongoose.model('subcategory' , subcategorySchema);
module.exports = subCategory