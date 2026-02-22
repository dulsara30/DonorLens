import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  TokenExpiredError,
  InvalidTokenError,
  AccountDisabledError,
  ValidationError,
  MissingFieldError,
  InvalidInputError,
  InvalidEmailError,
  InvalidPasswordError,
  FileUploadError,
  FileValidationError,
  FileSizeError,
  FileTypeError,
  CloudinaryError,
  DatabaseError,
  NotFoundError,
  DuplicateError,
  InvalidIdError,
  RecordNotFoundError,
  BadRequestError,
  ConflictError,
  InsufficientPermissionError,
  OperationNotAllowedError,
  ResourceExpiredError,
  PaymentError,
  InsufficientFundsError,
  TransactionError,
  ExternalServiceError,
  EmailServiceError,
  SMSServiceError,
  RateLimitError,
  QuotaExceededError,
  SessionExpiredError,
  InvalidStateError,
  TimeoutError,
  NetworkError,
  ConfigurationError,
  EnvironmentError,
} from "../utils/errors.js";

// ============================================
// GLOBAL ERROR HANDLER MIDDLEWARE
// ============================================
export const errorHandler = (err, req, res, next) => {
  // Log error details (for debugging)
  logError(err, req);

  // ============================================
  // 1️⃣ MULTER FILE UPLOAD ERRORS
  // ============================================
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      error: "File upload error",
      message: getMulterErrorMessage(err.code),
      code: err.code,
    });
  }

  // ============================================
  // 2️⃣ AUTHENTICATION & AUTHORIZATION ERRORS
  // ============================================
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: err.message,
      action: "Please login to continue",
    });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      success: false,
      error: "Forbidden",
      message: err.message,
      action: "You do not have permission to access this resource",
    });
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      error: "Token expired",
      message: err.message,
      action: "Please login again",
    });
  }

  if (err instanceof InvalidTokenError) {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
      message: err.message,
      action: "Please login again",
    });
  }

  if (err instanceof AccountDisabledError) {
    return res.status(403).json({
      success: false,
      error: "Account disabled",
      message: err.message,
      action: "Please contact support",
    });
  }

  // JWT Errors (from jsonwebtoken library)
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
      message: "Authentication token is invalid",
      action: "Please login again",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
      message: "Your session has expired",
      action: "Please login again",
    });
  }

  // ============================================
  // 3️⃣ VALIDATION ERRORS
  // ============================================
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      message: err.message,
      fields: err.fields, // Field-specific errors
    });
  }

  if (err instanceof MissingFieldError) {
    return res.status(400).json({
      success: false,
      error: "Missing field",
      message: err.message,
      field: err.field,
    });
  }

  if (err instanceof InvalidInputError) {
    return res.status(400).json({
      success: false,
      error: "Invalid input",
      message: err.message,
    });
  }

  if (err instanceof InvalidEmailError) {
    return res.status(400).json({
      success: false,
      error: "Invalid email",
      message: err.message,
    });
  }

  if (err instanceof InvalidPasswordError) {
    return res.status(400).json({
      success: false,
      error: "Invalid password",
      message: err.message,
    });
  }

  // Mongoose/MongoDB Validation Errors
  if (err.name === "ValidationError" && err.errors) {
    const errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(400).json({
      success: false,
      error: "Validation error",
      message: "Please check your input",
      fields: errors,
    });
  }

  // ============================================
  // 4️⃣ FILE UPLOAD & CLOUDINARY ERRORS
  // ============================================
  if (err instanceof FileUploadError) {
    return res.status(400).json({
      success: false,
      error: "File upload error",
      message: err.message,
    });
  }

  if (err instanceof FileValidationError) {
    return res.status(400).json({
      success: false,
      error: "File validation error",
      message: err.message,
    });
  }

  if (err instanceof FileSizeError) {
    return res.status(400).json({
      success: false,
      error: "File size error",
      message: err.message,
    });
  }

  if (err instanceof FileTypeError) {
    return res.status(400).json({
      success: false,
      error: "File type error",
      message: err.message,
    });
  }

  if (err instanceof CloudinaryError) {
    return res.status(500).json({
      success: false,
      error: "Cloud storage error",
      message: "Failed to upload files to cloud storage",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // ============================================
  // 5️⃣ DATABASE ERRORS
  // ============================================
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: "Not found",
      message: err.message,
      resource: err.resource,
    });
  }

  if (err instanceof RecordNotFoundError) {
    return res.status(404).json({
      success: false,
      error: "Record not found",
      message: err.message,
      model: err.model,
      id: err.id,
    });
  }

  if (err instanceof DuplicateError) {
    return res.status(409).json({
      success: false,
      error: "Duplicate entry",
      message: err.message,
      field: err.field,
    });
  }

  if (err instanceof InvalidIdError) {
    return res.status(400).json({
      success: false,
      error: "Invalid ID",
      message: err.message,
    });
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000 || err.code === 11001) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({
      success: false,
      error: "Duplicate entry",
      message: `${field} already exists`,
      field: field,
    });
  }

  // MongoDB Cast Error (Invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "Invalid ID",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(500).json({
      success: false,
      error: "Database error",
      message: "A database error occurred",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // ============================================
  // 6️⃣ BUSINESS LOGIC ERRORS
  // ============================================
  if (err instanceof BadRequestError) {
    return res.status(400).json({
      success: false,
      error: "Bad request",
      message: err.message,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      success: false,
      error: "Conflict",
      message: err.message,
    });
  }

  if (err instanceof InsufficientPermissionError) {
    return res.status(403).json({
      success: false,
      error: "Insufficient permissions",
      message: err.message,
    });
  }

  if (err instanceof OperationNotAllowedError) {
    return res.status(403).json({
      success: false,
      error: "Operation not allowed",
      message: err.message,
    });
  }

  if (err instanceof ResourceExpiredError) {
    return res.status(410).json({
      success: false,
      error: "Resource expired",
      message: err.message,
    });
  }

  // ============================================
  // 7️⃣ PAYMENT & TRANSACTION ERRORS
  // ============================================
  if (err instanceof PaymentError) {
    return res.status(402).json({
      success: false,
      error: "Payment error",
      message: err.message,
    });
  }

  if (err instanceof InsufficientFundsError) {
    return res.status(402).json({
      success: false,
      error: "Insufficient funds",
      message: err.message,
    });
  }

  if (err instanceof TransactionError) {
    return res.status(500).json({
      success: false,
      error: "Transaction error",
      message: err.message,
    });
  }

  // ============================================
  // 8️⃣ EXTERNAL SERVICE ERRORS
  // ============================================
  if (err instanceof ExternalServiceError) {
    return res.status(503).json({
      success: false,
      error: "External service error",
      message: err.message,
      service: err.service,
    });
  }

  if (err instanceof EmailServiceError) {
    return res.status(503).json({
      success: false,
      error: "Email service error",
      message: err.message,
    });
  }

  if (err instanceof SMSServiceError) {
    return res.status(503).json({
      success: false,
      error: "SMS service error",
      message: err.message,
    });
  }

  // ============================================
  // 9️⃣ RATE LIMITING & QUOTA ERRORS
  // ============================================
  if (err instanceof RateLimitError) {
    return res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      message: err.message,
      action: "Please try again later",
    });
  }

  if (err instanceof QuotaExceededError) {
    return res.status(429).json({
      success: false,
      error: "Quota exceeded",
      message: err.message,
    });
  }

  // ============================================
  // 🔟 SESSION & STATE ERRORS
  // ============================================
  if (err instanceof SessionExpiredError) {
    return res.status(401).json({
      success: false,
      error: "Session expired",
      message: err.message,
      action: "Please login again",
    });
  }

  if (err instanceof InvalidStateError) {
    return res.status(400).json({
      success: false,
      error: "Invalid state",
      message: err.message,
    });
  }

  // ============================================
  // 1️⃣1️⃣ NETWORK & TIMEOUT ERRORS
  // ============================================
  if (err instanceof TimeoutError) {
    return res.status(408).json({
      success: false,
      error: "Request timeout",
      message: err.message,
    });
  }

  if (err instanceof NetworkError) {
    return res.status(503).json({
      success: false,
      error: "Network error",
      message: err.message,
    });
  }

  // ============================================
  // 1️⃣2️⃣ CONFIGURATION & ENVIRONMENT ERRORS
  // ============================================
  if (err instanceof ConfigurationError) {
    return res.status(500).json({
      success: false,
      error: "Configuration error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Server configuration error",
    });
  }

  if (err instanceof EnvironmentError) {
    return res.status(500).json({
      success: false,
      error: "Environment error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Server configuration error",
    });
  }

  // ============================================
  // 1️⃣3️⃣ ALL OTHER OPERATIONAL ERRORS (AppError)
  // ============================================
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
    });
  }

  // ============================================
  // 1️⃣4️⃣ UNKNOWN/PROGRAMMING ERRORS
  // ============================================
  console.error("💥 UNHANDLED ERROR:", err);

  // In production, don't leak error details
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong. Please try again later.",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get user-friendly error message for Multer error codes
 */
function getMulterErrorMessage(code) {
  const errors = {
    LIMIT_FILE_SIZE: "File size exceeds the maximum limit",
    LIMIT_FILE_COUNT: "Too many files uploaded",
    LIMIT_FIELD_KEY: "Field name is too long",
    LIMIT_FIELD_VALUE: "Field value is too long",
    LIMIT_FIELD_COUNT: "Too many fields",
    LIMIT_UNEXPECTED_FILE: "Unexpected file field",
    MISSING_FIELD_NAME: "Field name is missing",
  };

  return errors[code] || "File upload error occurred";
}

/**
 * Log error details for debugging and monitoring
 */
function logError(err, req) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    userId: req.user?.id || "anonymous",
    error: {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode || 500,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  };

  // Log based on severity
  if (err.statusCode >= 500) {
    console.error("❌ SERVER ERROR:", JSON.stringify(errorLog, null, 2));
  } else if (err.statusCode >= 400) {
    console.warn("⚠️  CLIENT ERROR:", JSON.stringify(errorLog, null, 2));
  } else {
    console.log("ℹ️  ERROR:", JSON.stringify(errorLog, null, 2));
  }

  // In production, send to logging service (e.g., Sentry, LogRocket, Winston)
  // Example: sendToLoggingService(errorLog);
}

export default errorHandler;
