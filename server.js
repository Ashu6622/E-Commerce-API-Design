const express = require('express');
const dotenv = require('dotenv').config();
const app = express()
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const categoryRouter = require('./routes/categoryRoute');
const wishlistRouter = require('./routes/wishlistRoute');
const cartRouter = require('./routes/cartRoute');
const reviewRouter = require('./routes/reviewRoute');
const adminRouter = require('./routes/adminRoute');
const brandRouter = require('./routes/brandRoute');
const subCategoryRouter = require('./routes/subcategoryRoute');
const orderRouter = require('./routes/orderRoute');
const connectDB = require('./utils/DB');


app.use(cookieParser());
app.use(helmet());

app.use(express.json());

app.use((err,req,res,next)=>{
    res.status(500).json({error:err.message});
})

connectDB();


app.use('/users', userRoute);
app.use('/admin', adminRouter);
app.use('/products', productRouter);
app.use('/category', categoryRouter);
app.use('/subcategory', subCategoryRouter);
app.use('/brand', brandRouter);
app.use('/wishlist', wishlistRouter);
app.use('/cart', cartRouter);
app.use('/review', reviewRouter);
app.use('/order', orderRouter);


app.listen(process.env.PORT, (err)=>{
    if(err){
        console.log(err);
    }
    console.log(`App is Running on ${process.env.PORT}`)
})
