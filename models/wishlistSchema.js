const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
        unique:true
    },
    product_list:[{

        product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
        },
        addedAt:{
            type:Date,
            default: Date.now
       }
        
    }],
},{
    timestamps:true
}) 

const WishList = mongoose.model('wishlist', wishSchema);

module.exports = WishList;