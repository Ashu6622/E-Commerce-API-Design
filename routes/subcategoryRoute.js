const express = require('express');

const router = express.Router();

const subCategory = require('../models/subcategorySchema');
const {jwtAuth} = require('../utils/jwt')

router.get('/' , async (req, res)=>{

    try{
        //  get top subcategory which are frequently brought

        const data = await subCategory.find().sort({rating:-1}).select('name');

        return res.status(200).json({data});
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }

})


// only access by admins

router.post('/add', async (req, res)=>{

    try{
            const {name} = req.body;

            const isExit = await subCategory.findOne({name: {$regex: `^${name}$`, $options: 'i'}});
            
            if(isExit){
              return res.status(200).json({message:`${name} is alredy present`});
            }

            const newSubcategory = new subCategory({name:name});

            await newSubcategory.save();
            
            return res.status(201).json({data:newSubcategory});       
    }
    catch(error){
            return res.status(500).json({message:error.message})
    }
})

router.put('/update/:id', async (req, res)=>{

    try{
            const {id} = req.params;
            const data = req.body;

            const updatedData = await subCategory.findByIdAndDelete(id, data, {
                new:true,
                runValidators:true
            });

            return res.status(200).json({data:updatedData});
    }
    catch(error){
            return res.status(501).json({message:error.message});
    }
})

router.delete('/delete/:id', async (req, res)=>{

        try{

            const {id} = req.params;

            const deletedData = await subCategory.findByIdAndDelete(id);

            return res.status(200).json({data:deletedData})
        }
        catch(error){
            return res.status(500).json({message:error.message});
        }

})

module.exports = router;