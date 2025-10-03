import mongoose from "mongoose";


export async function connectDb() {

    try {

        let Connect = await mongoose.connect(`${process.env.mongoDB_Url}`);
        console.log("StayNow DataBase Connected")
    
    } catch (error) {

        console.log("Error in connecting to database",error);
        process.exit(1);
   
    }
    
}