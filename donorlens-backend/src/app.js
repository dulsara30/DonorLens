import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth/auth.route.js";

const createApp = () => {
    dotenv.config();
    const app = express();
    
    // Security middleware
    app.use(helmet());
    
    // Body parser middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Cookie parser middleware
    app.use(cookieParser());

    // CORS configuration - allow credentials for HttpOnly cookies
    app.use(
        cors({
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true, // Important: allows cookies to be sent
        })
    );

    // Connect to MongoDB
    connectDB();

    // Health check endpoint
    app.get("/health", (req, res) => {
        res.status(200).json({ 
            success: true, 
            message: "DonorLens API is running",
            timestamp: new Date().toISOString()
        });
    });

    // API Routes
    app.use("/api/auth", authRouter);

    // 404 handler for undefined routes
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found",
        });
    });

    return app;

}

export default createApp;