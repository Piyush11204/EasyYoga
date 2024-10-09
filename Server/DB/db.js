const mongoose = require('mongoose');


const connectDB = async () =>{
    try {
        
        const connectionInstance =await mongoose.connect(`${process.env.DB_URL}`,{})
        console.log(`MongoDB is connected !!! DB HOST :${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error", error)
        process.exit(1)
    }
}
module.exports =connectDB;
// DB_URL ="mongodb+srv://piyush11204:Piyush11204@dummydb.teft0.mongodb.net/ProjectDB"

// JWTPRIVATEKEY =piyush@1122334

// SALT = 10
// SESSION_SECRET="470429310888-5bba0lvv82abbd7eag26962bq6tos3lb.apps.googleusercontent.com"
// GOOGLE_CLIENT_ID_KEY='470429310888-5bba0lvv82abbd7eag26962bq6tos3lb.apps.googleusercontent.com'
// GOOGLE_CLIENT_SECRET_KEY='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'