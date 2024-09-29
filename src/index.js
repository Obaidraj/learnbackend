// require("dotenv").config({path:'./.env'});
import dotenv from "dotenv"
 import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path:'./.env'
});
const port=process.env.PORT||8080




connectDB().then(()=>{
    app.listen(port,()=>console.log(`Sever is running on ${port} `))
}).catch(error=>{
    console.log("Mongo DB connection failed:",error)
});




















// import express from 'express';
// const app=express();
// (async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//        app.on('error',error=>{
//         console.error("ERROR:",error)
//         throw error

//        })
//        app.listen(process.env.PORT,()=>console.log(`Server running at port ${process.env.PORT}`))
//     } catch (error) {
//         console.error("ERROR:",error)
//         throw error
//     }
// })()