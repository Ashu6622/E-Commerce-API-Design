const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment_list: [{
  text:{
    type: String,
    required:true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  addedAt:{
    type:Date,
    default: Date.now
  }
}],
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
    unique:true
  }
},
{
    timestamps:true
});

const Reviews = mongoose.model("reviews", reviewSchema);

module.exports = Reviews;
