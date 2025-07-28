const express = require('express');

const router = express.Router();
const Cart = require('../models/cartSchema');
const User = require('../models/userSchema');
const {jwtAuth} = require('../utils/jwt');

router.get('/allitems', jwtAuth, async (req, res)=>{

        // extract userId from jwt Middle ware token
        // user and admin both have the access to this route

    try{

        const {id} = req.user_id;

        const cartData = await Cart.findOne({user_id:id});
        
        if(!cartData){
            return res.status(200).json({message:'Nothing Added in Cart Yet'})
        }

        return res.status(200).json({data: cartData.cart_items});
    }
    catch(error){
        return res.status(402).json({message:error.message});
    }
})

router.post('/additem', jwtAuth, async (req,res)=>{

    try{
        const {id} = req.user_id;

        // admin can not add product in the cart

        const isAdmin = await User.findOne({_id:id});

        if(!isAdmin){
            return res.status(401).json({message:'You cannot add Product to cart'});
        }

        // first find if the cart is already exit then just add the product

        const {productId} = req.body;

        const userCart = await Cart.findOne({user_id:id});

        if(userCart){

            const findProduct = userCart.cart_items.findIndex((items)=> items.product_id.toString() === productId.toString());

            if(findProduct >= 0){
                return res.status(200).json({message:'Product is already present in Cart'});
            }

            userCart.cart_items.push({product_id:productId})

            await userCart.save()
            return res.status(201).json({data:userCart});
        }

        const cartObject = {
            user_id:id,
            cart_items : [{
                product_id:productId
            }]
        }

        const newCart = new Cart(cartObject);

        await newCart.save();

        return res.status(201).json({cart:newCart});
       
    }
    catch(error){
        return res.status(400).json({message:error.message}) 
    }

})

router.delete('/removeitem', jwtAuth, async (req,res)=>{

    // get user if from jwt Middle ware from token

    try{
        const {id} = req.user_id;
        const {productId} = req.body;

        const userCart = await Cart.findOne({user_id:id});

        
        userCart.cart_items = userCart.cart_items.filter((items)=> items.product_id.toString() !== productId.toString());
        
        await userCart.save();

        return res.status(200).json({data:userCart});

    }
    catch(error){
        return res.status(400).json({message:error.message});
    }

})

module.exports = router