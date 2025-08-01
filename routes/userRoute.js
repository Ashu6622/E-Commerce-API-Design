const express = require('express');

const router = express.Router();
const User = require('../models/userSchema');
const {generateToken, jwtAuth} = require('../utils/jwt');
const bcrypt = require('bcryptjs');


router.post('/signin', async (req, res)=>{

    try{

        const data = req.body;

        const emailExit = await User.findOne({email:data.email});

        if(emailExit){
            return res.status(400).json({message:'user already exit with this email'});
        }

        const phoneExit = await User.findOne({phone:data.phone});

        if(phoneExit && phoneExit.phone === data.phone){
            return res.status(400).json({message:'user already exit with this phone number'});
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(data.password, salt);

        data.password = hashedPassword;

        const newUser = new User(data);
        await newUser.save();

        const token = generateToken({id:newUser._id});

        return res.cookie('token', token , {httpOnly:true ,  maxAge:360000}).status(201).json({newUser});

    }catch(error){
        return res.status(401).json({message:error.message})
    }
})

router.post('/login', async (req,res)=>{

     try{

        const {email, password} = req.body;

        const isuserExit = await User.findOne({email}).select('password');

        if(!isuserExit){
            return res.status(401).json({error:'User Not Find With this email'});
        }

        // compare the hashed password

        const isMatch = await bcrypt.compare(password, isuserExit.password);

        if(!isMatch){
                return res.status(402).json({error:'Incorrect Password'});
        }

        const token = generateToken({id:isuserExit._id});
        
        return res.cookie('token',token, {httpOnly:true, maxAge:360000} ).status(201).json({message:'successfully login'});

    }catch(error){
        return res.status(401).json({message:error.message})
    }

})

router.get('/allusers' , jwtAuth , async(req, res)=>{

    // this route is only accessible to admin

    try{
        const {id} = req.user_id;

        const findAdmin = await User.findOne({_id:id});

        // if the admin is present in user then he is not admin

        if(findAdmin){
            return res.status(401).json({message:'You are not allowed to access this'})
        }

        const allUser = await User.find();

        return res.status(200).json({data:allUser});

    }
    catch(error){
        return res.status(404).json({message:error.message});
    }
})

router.get('/profile', jwtAuth, async(req, res)=>{

    // get user id from jwt Middle ware Token to filter the user from collection

    try{

        const {id} = req.user_id;
        const userData = await User.findById(id);

        return res.status(200).json({message:'got the data',data:userData});
    }catch(error){
        return res.status(401).json({message:error.message});
    }

})

router.patch('/update', jwtAuth, async (req, res)=>{

    try{
        const {id} = req.user_id;
        const data = req.body
        const updatedData = await User.findByIdAndUpdate(id, data, {
            new:true,
            runValidators:true
        });

        return res.status(201).json({data:updatedData});
    }
    catch(error){

        return res.status(401).json({error:error.message});
    }

})

router.post('/logout', jwtAuth, (req,res)=>{

    try{
        res.clearCookie('token', {httpOnly:true ,  maxAge:360000});
        res.status(200).json({ message: 'Logged out successfully'});
    }
    catch(error){
        return res.json({message:error.message});
    }
})

module.exports = router

