import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Email Configuration for DonorLens
 * Configure your email service credentials in .env file
 */

// Create transporter with your email service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email address from .env
    pass: process.env.SMTP_PASS, // Your app password from .env
  },
});

// Configure Handlebars template engine
const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    layoutsDir: path.resolve(__dirname, "../templates/layouts"),
    defaultLayout: "main",
    partialsDir: path.resolve(__dirname, "../templates/email"),
  },
  viewPath: path.resolve(__dirname, "../templates/email"),
  extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export default transporter;
