import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {

    const uri =  process.env.MONGO_URI

    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected Successfully!");
    } catch (e) {
        console.error("MongoDB Connection error:", e.message);
        process.exit(1);
    }

};

export default connectDB;