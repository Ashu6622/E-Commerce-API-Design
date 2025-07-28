const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    trim: true,
    unique:true,
  },
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"category",
    required:true
  },
  subcategory:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'subcategory',
    required:true
  },
  brand:{
     type: mongoose.Schema.Types.ObjectId,
     ref:'brand',
     required:true
  },
  stock: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0, 
  },
  numReviews: {
    type: Number,
    default: 1, 
  },
  total_rating:{
    type:Number,
    default : 0
  }
},
{
    timestamps:true
});
const Product = mongoose.model("product", productSchema);

module.exports = Product;
