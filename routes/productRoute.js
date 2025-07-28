const express = require('express');
const Product = require('../models/productSchema');
const router = express.Router();
const {jwtAuth} = require('../utils/jwt');
const Admin = require('../models/adminSchema');

router.get('/', async (req, res)=>{

    try{

        const hasquery = req.query;

        console.log(hasquery);

        // if there is no query then fetch newly added product limit 20

        if(Object.keys(hasquery).length === 0){
            const data = await Product.find().sort({createdAt: -1, rating:-1}).limit(20);
            return res.status(201).json({data});
        }
       

            // collect all the filter query in the filter object, as there can be different number of query like minPrice, maxPrice, Category
          
            const filter = {};

           
            if(hasquery.category){
                filter.category =  hasquery.category
            }
            if(hasquery.subcategory){
                filter.subcategory =  hasquery.subcategory
            }
            if(hasquery.brand){
                filter.brand =  hasquery.brand
            }
            if(hasquery.minPrice){
                filter.price =  {$gte:parseInt(hasquery.minPrice)}
            }
            if(hasquery.maxPrice){
                filter.price =   {$lte:parseInt(hasquery.maxPrice)}
            }
            if(hasquery.rating){
                filter.rating =  {$gte:Number(hasquery.rating)};
            }

           const data = await Product.find(filter).sort({createdAt:-1}).limit(20);
           return res.status(200).json({data});

        

    }catch(error){
            return res.status(403).json({message:error.message});
    }

})


// get single product

router.get('/:id', async (req, res)=>{

    try{
        const {id} = req.params
        const data = await Product.findById({_id:id});
        return res.status(200).json({data});
    }
    catch(error){
        res.status(404).json({message:error.message});
    }
})


// below route is only accessible by admin

router.post('/add_product',jwtAuth, async (req,res)=>{

    try{

        const {id} = req.user_id;
        
        const isAdmin = await Admin.findById(id);

        if(!isAdmin){
            return res.status(401).json({message:'You cannot add Product'})
        }
        
        // check if product is already added
        
        const data = req.body;

        const productExit = await Product.findOne({name: {$regex: `^${data.name}$`, $options: 'i'}});

        if(productExit){
            return res.status(200).json({message:'Product is already Present'});
        }

        const newProduct = new Product(data);
        await newProduct.save();
        return res.status(201).json({data:newProduct})
    }
    catch(error){
        return res.status(403).json({message:error.message})
    }

})

router.patch('/update_product/:id', jwtAuth, async (req, res)=>{

    try{
        const data = req.body;
        const {id} = req.params;
        console.log(data, id)

        const newData = await Product.findByIdAndUpdate(id, data, {
            new:true,
            runValidators:true
        })

         return res.status(201).json({data:newData});
    }
    catch(error){
         return res.status(402).json({message:error.message})
    }

})

router.delete('/delete_product/:id', jwtAuth, async (req, res)=>{

    try{
        const {id} = req.params;

        const deletedData = await Product.findByIdAndDelete({_id:id});

        return res.status(200).json({data:deletedData})
    }
    catch(error){

    }

})

module.exports = router