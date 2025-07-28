const express = require('express');
const router = express.Router();
const Brand = require('../models/brandSchema');
const {jwtAuth, generateToken} = require('../utils/jwt');
const Product = require('../models/productSchema');


router.get('/', async (req, res)=>{

    // get top brand first

        try{

            const allbrand = await Brand.find().sort({rating:-1}).select('name');

            return res.status(200).json({data:allbrand});

        }
        catch(error){
            return res.status(501).json({message:error.message});
        }

})

// only access by admins

router.post('/add', async (req, res)=>{

    try{
        const {brandName} = req.body

         // do not add duplicate data

        const brandExit = await Brand.findOne({name: {$regex: `^${brandName}$`, $options: 'i'}});

        if(brandExit){
          return res.status(200).json({message:`${brandName} is alredy present`});
        }

        const newBrand = new Brand({name:brandName});
        await newBrand.save();

        return res.status(201).json({data:newBrand});

    }
    catch(error){
        return res.status(500).json({message:error.message});
    }

})

router.put('/update/:id', async (req, res)=>{

    try{
            const {id} = req.params;
            const data = req.body;

            const updatedBrand = await findByIdAndUpdate(id, data, {
                new:true,
                runValidators:true
            })

            return res.status.json({data:updatedBrand});
    }
    catch(error){
            return res.status(501).json({message:error.message});
    }

})

router.delete('/delete/:id', async (req, res)=>{

    try{
            const {id} = req.params;
            
            const deletedData = await findByIdAndDelete(id);

            return res.status(200).json({data:deletedData})
    }
    catch(error){
            return res.status(501).json({message:error.message}); 
    }

})

module.exports = router;