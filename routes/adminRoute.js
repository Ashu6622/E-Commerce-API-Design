const express = require('express');

const router = express.Router();
const Admin = require('../models/adminSchema');
const {generateToken, jwtAuth} = require('../utils/jwt');
const bcrypt = require('bcryptjs');


router.post('/register', async(req, res)=>{

    try{

        const data = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.password, salt);
        data.password = hashPassword;

        const newAdmin = new Admin(data);
       
        await newAdmin.save();
    
        const token = generateToken({id:newAdmin._id})

        return res.cookie('token', token, {httpOnly:true, maxAge:360000}).status(201).json({data:newAdmin});
    }
    catch(error){
        return res.status(401).json({message:error.message});
    }
    
})

router.post('/login', async (req, res)=>{

    try{
        const {email , password} = req.body;

        // first check with email if admin exit 

        if(!email|| !password){
            return res.status(402).json({message:'field is missing'});
        }

        const adminExit = await Admin.findOne({email}).select('password');

        if(!adminExit){
            return res.status(404).json({message:'Admin not found with this email'});
        }

        // compare the password with hash

        isMatch = await bcrypt.compare(password, adminExit.password)

        if(!isMatch){
            return res.status(404).json({message:'Incorrect Password'});
        }

        const token = generateToken({id:adminExit._id});

        return res.cookie('token', token, {httpOnly:true, maxAge:360000}).status(201).json({data:adminExit});

    }
    catch(error){
        return res.status(501).json({message:error.message})
    }

})

router.patch('/update', jwtAuth , async (req,res)=>{

    try{

        const {id} = req.user_id;
        const data = req.body;

        const updatedValue = await Admin.findByIdAndUpdate(id, data, {
            new:true,
            runValidators:true
        })

        return res.status(201).json({data:updatedValue});

    }
    catch(error){
        return res.status(500).json({message:error.message});
    }

})

module.exports = router;