const express = require('express');
const router = express.Router();

const Reviews = require('../models/reviewSchema')
const User = require('../models/userSchema')
const Product = require('../models/productSchema')
const Category = require('../models/categorySchema')
const subCategory = require('../models/subcategorySchema')
const Brand = require('../models/brandSchema')
const {jwtAuth} = require('../utils/jwt');

router.get('/getreview' , async (req,res)=>{

    // get product_id is from http body
    // and get user id from jwt Middle ware token

    // give the recent review

    try{

        const {product_id} = req.body;
        const allReviews = await Reviews.findOne({product_id}).select('comment_list');

        // .select also give the _id along with the selected fields
        if(!allReviews){
            return res.status(200).json({message:'No review for this Product'})
        }


        // get the newest comment
        const newestComment = allReviews?.comment_list?.sort((a,b)=> new Date(b.addedAt) - new Date(a.addedAt));

        return res.status(200).json(newestComment);
        
    }
    catch(error){
        return res.status(402).json({message:error.message});
    }

})

router.post('/addreview' ,jwtAuth, async (req, res)=>{

    // get product id from http body
    // and user id from jwt Middle ware token

    // first check weather the review is given by user not by admin

    try{

        const {id} = req.user_id;

        const Role = await User.findOne({_id:id});

        if(!Role){
            return res.status(403).json({message:"You cannot Give Review"});
        }

        const data = req.body;

        const getReview = await Reviews.findOne({product_id:data.product_id});

        const filteredProduct = await Product.findById(data.product_id);

        // also update the rating of the corresponding categories, to sort then according to the rating
        const category = await Category.findById(filteredProduct.category);
        const subcategory = await subCategory.findById(filteredProduct.subcategory);
        const brand = await Brand.findById(filteredProduct.brand);
        
        const temp =  {
            text : data.text,
            user_id:id,
            rating : data.rating.toFixed(1),
        }
        
        // if product is already present then do not create just add the review to it
        if(getReview){
            filteredProduct.numReviews = filteredProduct.numReviews + 1;

            filteredProduct.total_rating = filteredProduct.total_rating + data.rating

            filteredProduct.rating = ( filteredProduct.total_rating)/filteredProduct.numReviews;
            filteredProduct.rating = filteredProduct.rating.toFixed(1);

            category.count = category.count + 1;
            subcategory.count = subcategory.count + 1;
            brand.count = brand.count + 1;

            category.total_rating = category.total_rating + data.rating;
            subcategory.total_rating = subcategory.total_rating + data.rating;
            brand.total_rating = brand.total_rating + data.rating;

            category.rating = (category.total_rating)/category.count
            subcategory.rating = (subcategory.total_rating)/subcategory.count
            brand.rating = (brand.total_rating)/brand.count

            category.rating = category.rating.toFixed(1);
            subcategory.rating = subcategory.rating.toFixed(1);
            brand.rating = brand.rating.toFixed(1);

            await category.save()
            await subcategory.save()
            await brand.save()
            await filteredProduct.save()

            getReview.comment_list.push(temp);
            await getReview.save()
            return res.status(201).json({data:getReview});
        }

        // new product review list

        const productReview = {};
        productReview.product_id = data.product_id;
        productReview.comment_list = [temp];

        filteredProduct.rating = data.rating;
        filteredProduct.total_rating = data.rating;
        await filteredProduct.save()

        if(category.count === 0){
            category.rating = data.rating
        }
        if(subcategory.count === 0){
            subcategory.rating = data.rating
        }
        if(brand.rating === 0){
            brand.rating = data.rating
        }

        category.count = category.count + 1
        subcategory.count = subcategory.count + 1
        brand.count =  brand.count + 1

        category.total_rating = category.total_rating + data.rating;
        subcategory.total_rating = subcategory.total_rating + data.rating;
        brand.total_rating = brand.total_rating + data.rating;

         category.rating = (category.total_rating)/category.count
         subcategory.rating = (subcategory.total_rating)/subcategory.count
         brand.rating = (brand.total_rating)/brand.count 

         category.rating = category.rating.toFixed(1);
         subcategory.rating = subcategory.rating.toFixed(1);
         brand.rating = brand.rating.toFixed(1);

        await category.save()
        await subcategory.save()
        await brand.save()
       
        // if not present then create new product review

        const newProduct = new Reviews(productReview);
        await newProduct.save();
        return res.status(201).json({data:newProduct});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }

})

router.delete('/deletereview', jwtAuth, async(req, res)=>{

    try{

        const {id} = req.user_id;

        // admin can not delete the review

        const Role = await User.findOne({_id:id}).select('id');

        if(!Role){
             return res.status(401).json({message:"You cannot Delete Review"});
        }

        
        const {product_id, text_id} = req.body;
        const findProduct = await Reviews.findOne({product_id});
       
        // user can only delete your own review

        const uniqueComment = findProduct.comment_list?.find((items)=> items._id.toString() === text_id.toString());


        if(!uniqueComment){
            return res.status(400).json({message:'Review Not Found'})
        }

        if(uniqueComment.user_id.toString() !== id.toString()){
                return res.status(403).json({message:`You cannot delete other's review`})
        }

        findProduct.comment_list = findProduct.comment_list.filter((items)=> items._id.toString() !== text_id.toString())

        await findProduct.save();

        return res.status(201).json({data:findProduct});
    }
    catch(error){
        return res.status(401).json({message:error.message});
    }

})

module.exports = router


