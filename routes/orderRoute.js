const express = require('express');

const router = express.Router();
const Order = require('../models/orderSchema');
const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const {jwtAuth} = require('../utils/jwt');

router.get('/allorders', jwtAuth, async (req, res)=>{

    try{

        // get the latest order on the top

        const {id} = req.user_id;

        const orderData = await Order.findOne({user_id:id}).select('orderList');

        orderData.orderList.sort((a,b)=>  new Date(b.orderDate) - new Date(a.orderDate));

        return  res.status(200).json({data:orderData})

    }
    catch(error){
        return res.status(502).json({message:error.message});
    }

})

router.get('/orderdetails/:order_id' , jwtAuth, async (req, res)=>{

    try{

        const {id} = req.user_id;
        const {order_id} = req.params;

        const orderList = await Order.findOne({user_id:id}).select('orderList');

        if(!orderList){
            return res.status(502).json({message:'Not Placed any order yet'});
        }

        const selctedOrder = orderList.orderList.find((items)=> items._id.toString() === order_id.toString());

        if(!selctedOrder){
             return res.status(502).json({message:'Not found any order with this Id'});
        }
        
        return res.status(200).json({data:selctedOrder});

    }
    catch(error){
        return res.status(501).json({message:error.message});
    }

})

router.post('/addorder', jwtAuth, async (req, res)=>{

    try{

        // admin can not add order

        const {id} = req.user_id;

        const isUser = await User.findOne({_id:id});
        if(!isUser){
            return res.status(401).json({message:'You can not Place Order'});
        }

        // also decrease the stock quantity of products ordered

        const data = req.body;
        

        // calculate total amount or order and add user name and phone number here

        data.deliveryAddress.fullName = isUser.name;
        data.deliveryAddress.phone = isUser.phone;

        let totalAmount = 0;

        for(let x of data.orderItems){
            totalAmount += x.price*x.quantity;

            // update stock
            const product = await Product.findById(x.product_id).select('stock');
            product.stock = product.stock - x.quantity;
            await product.save();
        }

        data.totalAmount = totalAmount

        // check if user alreay have order document, then just add the current order to it

        const isPresent = await Order.findOne({user_id:id}).select('orderList');

        if(isPresent){
            isPresent.orderList.push(data);
            await isPresent.save();
            return res.status(201).json({data:isPresent})
        }
        
        const temp = {}

        temp.user_id = id;
        temp.orderList = data

        const newOrder = new Order(temp);
        await newOrder.save();

        return res.status(200).json({data:newOrder});
    }
    catch(error){
        return res.status(501).json({message:error.message});
    }

})

router.patch('/cancelOrder/:order_id', jwtAuth, async (req, res)=>{

    try{

        const {id} = req.user_id;
        const {order_id} = req.params;

        // find order
        const selectedOrder = await Order.findOne({user_id:id}).select('orderList');

        // cancel order
        const idx = selectedOrder.orderList.findIndex((items)=> items._id.toString() === order_id.toString());

        if(idx === -1){
            return res.status(404).json({message:'Order Not Found With this Id'});
        }

        selectedOrder.orderList[idx].status = "Cancelled";
        
        await selectedOrder.save();

        return res.status(201).json(selectedOrder.orderList[idx]);

    }
    catch(error){
        return res.status(501).json({message:error.message});
    }
})


// update the order status

router.patch('/updatestatus/:order_id', jwtAuth, async (req, res)=>{

    try{
        const {id} = req.user_id;
        const {order_id} = req.params;
        const {status, userId} = req.body;

        // not access by the user
        // if id found then it is a user not admin
        const isUser = await User.findById(id);
        if(isUser){
            return res.status(401).json({message:'You cannot make changes to this route'});
        }

        // find order
        const selectedOrder = await Order.findOne({user_id:userId}).select('orderList');

        // update order status
        const idx = selectedOrder.orderList.findIndex((items)=> items._id.toString() === order_id.toString());

        if(idx === -1){
            return res.status(404).json({message:'Order Not Found With this Id'});
        }

        selectedOrder.orderList[idx].status = status;

        if(status === "Delivered"){
            selectedOrder.orderList[idx].paymentStatus = "Paid";
        }
        
        await selectedOrder.save();

        return res.status(200).json({data:selectedOrder.orderList[idx]});

    }
    catch(error){
        return res.status(502).json({message:error.message});
    }
})

module.exports = router