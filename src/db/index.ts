import mongoose from "mongoose";
import { dbConfig } from "../config/db";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${dbConfig.MONGODB_URI}/${dbConfig.DB_NAME}`);
        console.log("MongoDB connected!! DB Host: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("mongoDB connection error: ", error);
        process.exit(1);
    }
}

export default connectDB;