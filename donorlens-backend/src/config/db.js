import mongoose from 'mongoose';
import dotenv from 'dotenv';
import loggerService from '../services/logger.service.js';

dotenv.config();

const connectDB = async () => {

    const uri =  process.env.MONGO_URI

    try {
        mongoose.set("sanitizeFilter", true);
        await mongoose.connect(uri);
        loggerService.logDB("MongoDB Connected Successfully!");
    } catch (e) {
        loggerService.error("MongoDB Connection error:", e);
        process.exit(1);
    }

};

export default connectDB;