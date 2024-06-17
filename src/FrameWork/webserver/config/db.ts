import mongoose from "mongoose";
require('dotenv').config()

const DB_connect:string =process.env.Mongo_Url || ''
console.log(DB_connect)
//database connection
const connectDb = async ()=>{
    try{
        await mongoose.connect(DB_connect)
        .then((data:any)=>console.log(`Db connected ${data.connection.host}`))
    }catch(error:any){
        console.log(error);
        
    }
}

export default connectDb