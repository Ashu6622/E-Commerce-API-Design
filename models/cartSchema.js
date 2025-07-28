const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
      unique:true
    },
    cart_items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          red: "product",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
