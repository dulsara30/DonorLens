import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

// Ensure logs directory exists
const LOG_DIR = process.env.LOG_DIR || path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Colors for console logging
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  verbose: "cyan",
  debug: "blue",
  silly: "gray",
};

winston.addColors(colors);

// Sensitive fields to redact from logs
const SENSITIVE_FIELDS = [
  "password",
  "confirmPassword",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
  "secret",
  "creditCard",
  "cardNumber",
  "cvv",
];

/**
 * Helper to sanitize sensitive data from log metadata
 */
const sanitizeData = (data) => {
  if (!data || typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized = { ...data };
  for (const key of Object.keys(sanitized)) {
    if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  return sanitized;
};

// Custom console format for local development terminal output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let logStr = `[${timestamp}] [${level}]: ${message}`;

    // Append stack trace if available
    if (stack) {
      logStr += `\n${stack}`;
    }

    // Append metadata if present
    const cleanMeta = sanitizeData(meta);
    if (cleanMeta && Object.keys(cleanMeta).length > 0) {
      logStr += `\n${JSON.stringify(cleanMeta, null, 2)}`;
    }

    return logStr;
  })
);

// Custom JSON format for structured file logging
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.errors({ stack: true }),
  winston.format((info) => {
    const { timestamp, level, message, stack, ...meta } = info;
    return {
      timestamp,
      level,
      message,
      stack,
      service: "donorlens-backend",
      environment: process.env.NODE_ENV || "development",
      meta: sanitizeData(meta),
    };
  })(),
  winston.format.json()
);

// Configure transports
const transports = [
  // Console Transport
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
    format: consoleFormat,
  }),
  // Daily Rotate File Transport for Errors
  new DailyRotateFile({
    filename: path.join(LOG_DIR, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: "error",
    format: fileFormat,
  }),
  // Daily Rotate File Transport for Combined Logs
  new DailyRotateFile({
    filename: path.join(LOG_DIR, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: process.env.LOG_LEVEL || "info",
    format: fileFormat,
  }),
  // Daily Rotate File Transport for HTTP Requests
  new DailyRotateFile({
    filename: path.join(LOG_DIR, "http-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "http",
    format: fileFormat,
  }),
];

// Create Winston Logger Instance
const winstonInstance = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  transports,
  exitOnError: false,
});

/**
 * Winston Logging Manager Service for DonorLens Backend
 */
class LoggerService {
  constructor() {
    this.logger = winstonInstance;
  }

  /**
   * Log an informational message
   */
  info(message, meta = {}) {
    this.logger.info(message, sanitizeData(meta));
  }

  /**
   * Log an error message
   */
  error(message, errOrMeta = {}) {
    if (errOrMeta instanceof Error) {
      this.logger.error(message, {
        error: {
          name: errOrMeta.name,
          message: errOrMeta.message,
          stack: errOrMeta.stack,
        },
      });
    } else {
      this.logger.error(message, sanitizeData(errOrMeta));
    }
  }

  /**
   * Log a warning message
   */
  warn(message, meta = {}) {
    this.logger.warn(message, sanitizeData(meta));
  }

  /**
   * Log an HTTP request message
   */
  http(message, meta = {}) {
    this.logger.http(message, sanitizeData(meta));
  }

  /**
   * Log a debug message
   */
  debug(message, meta = {}) {
    this.logger.debug(message, sanitizeData(meta));
  }

  /**
   * Express Middleware to automatically log HTTP requests
   */
  httpMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        const logData = {
          method: req.method,
          url: req.originalUrl || req.url,
          status: statusCode,
          duration: `${duration}ms`,
          ip: req.ip || req.socket?.remoteAddress,
          userAgent: req.get("user-agent"),
          userId: req.user?.id || req.user?._id || "anonymous",
          query: sanitizeData(req.query),
        };

        const message = `${req.method} ${req.originalUrl || req.url} ${statusCode} - ${duration}ms`;

        if (statusCode >= 500) {
          this.error(message, logData);
        } else if (statusCode >= 400) {
          this.warn(message, logData);
        } else {
          this.http(message, logData);
        }
      });

      next();
    };
  }

  /**
   * Dedicated error logging method for global error handler middleware
   */
  logErrorDetails(err, req) {
    const errorLog = {
      method: req?.method,
      url: req?.originalUrl || req?.url,
      ip: req?.ip,
      userAgent: req?.get ? req.get("user-agent") : undefined,
      userId: req?.user?.id || req?.user?._id || "anonymous",
      error: {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode || 500,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
    };

    const statusCode = err.statusCode || 500;
    if (statusCode >= 500) {
      this.error(`❌ SERVER ERROR: ${err.message}`, errorLog);
    } else if (statusCode >= 400) {
      this.warn(`⚠️ CLIENT ERROR: ${err.message}`, errorLog);
    } else {
      this.info(`ℹ️ OPERATIONAL ERROR: ${err.message}`, errorLog);
    }
  }

  /**
   * Domain-specific helper logging methods
   */
  logAuth(message, meta = {}) {
    this.info(`[AUTH] ${message}`, meta);
  }

  logDB(message, meta = {}) {
    this.info(`[DATABASE] ${message}`, meta);
  }

  logPayment(message, meta = {}) {
    this.info(`[PAYMENT] ${message}`, meta);
  }

  logEmail(message, meta = {}) {
    this.info(`[EMAIL] ${message}`, meta);
  }
}

export const loggerService = new LoggerService();
export const logger = winstonInstance;
export default loggerService;
