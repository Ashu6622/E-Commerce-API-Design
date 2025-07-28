const express = require('express');

const router = express.Router();
const WishList = require('../models/wishlistSchema');
const {jwtAuth} = require('../utils/jwt');
const User = require('../models/userSchema');

router.post('/addwish', jwtAuth, async(req, res)=>{

    try{

        const {id} = req.user_id // from jwt middleware
        
        // admin can not add wish
        const isUser = await User.findById(id).select('name');
        if(!isUser){
            return res.status(401).json({message:'You cannot add product to wishlist'});
        }
        
        const {productId} = req.body;

        // first check if the user already have wish list
        const isWishExit = await WishList.findOne({user_id:id});
        // if wishlist is already present then simply add the wish to the wishlist also check if the product is already present in the wishlist
        if(isWishExit){

            // check if the product is already present in the wishlist
            const productExit = isWishExit.product_list.findIndex((items)=> items.product_id.toString() === productId.toString());
            if(productExit > -1){
                return res.status(200).json({message:'Product is alredy present in wishlist'})
            }
            isWishExit.product_list.push({product_id:productId});
            await isWishExit.save();
            return res.status(201).json({data:isWishExit});
        }

        // if user donot have wish then first create and then add wish product
        
        const newWish = new WishList({user_id:id});
        
        newWish.product_list.push({product_id:productId}); 
        await newWish.save();

        return res.status(201).json({data:newWish});

    }
    catch(error){
        return res.status(403).json({message:error.message});
    }

    
})

router.delete('/removewish', jwtAuth, async(req, res)=>{

        // get user_id through jwt middleware
        // and get product_id through body

        try{
            const {id} = req.user_id;

            // admin can not remove product from wishlist
            const isUser = await User.findById(id).select('name');

            if(!isUser){
                return res.status(401).json({message:'You cannot delete product from wishlist'});
            }

            const {productId} = req.body;

            const wishlist = await WishList.findOne({user_id:id});
            
            if(wishlist.product_list.length === 0){
                return res.status(201).json({message:'wishlist is empty'})
            }

            wishlist.product_list = wishlist?.product_list?.filter((items)=>  items.product_id.toString() !== productId.toString());
            await wishlist.save();
            return res.status(200).json({data:wishlist});
        }
        catch(error){
            return res.status(401).json({message:error.message});
        }

})


// admin will also have access to this route

router.get('/allwish', jwtAuth, async(req, res)=>{

    // get user Id from jwt middleware 

    try{
        const {id} = req.user_id;

       const userWish = await WishList.findOne({user_id:id});  //check if user have wishlist or not

        if(!userWish || userWish.product_list.length === 0){
            return res.status(401).json({message:'You do not have wishlist'});
        }
        
        const allWishesh = userWish.product_list;
        return res.status(200).json({data:allWishesh});

    }
    catch(error){
        return res.status(403).json({message:error.message});
    }

})

module.exports = router