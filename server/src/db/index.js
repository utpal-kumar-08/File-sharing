import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv"

dotenv.config();

const connectDB=async ()=>{
    try {
        const connectionInstance = await mongoose.connect("mongodb+srv://inventory:inventory@clustermajor.2nxkgvl.mongodb.net");
        console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
}
export default connectDB;

