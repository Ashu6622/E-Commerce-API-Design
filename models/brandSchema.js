const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    count:{
      type:Number,
      default:0
    },
    total_rating:{
      type:Number,
      default:0,
    }
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("brand", brandSchema);
module.exports = Brand;
