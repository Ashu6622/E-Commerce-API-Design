const mongoose = require('mongoose');

const connectDB = async ()=>{

    try{

        await mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.wsvft1j.mongodb.net/`, {
            dbName:'E-Commerce_API_Design'
        })

        console.log('DB connected')
    }
    catch(error){
        console.log('Error in Connection with DB')
    }
   
}

module.exports = connectDB;