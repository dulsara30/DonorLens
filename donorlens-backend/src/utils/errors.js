// ============================================
// BASE ERROR CLASS
// ============================================
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true; // Operational errors (expected)
    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================
// 1️⃣ AUTHENTICATION & AUTHORIZATION ERRORS
// ============================================
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message = "Token has expired") {
    super(message, 401);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message = "Invalid token") {
    super(message, 401);
  }
}

export class AccountDisabledError extends AppError {
  constructor(message = "Account is disabled") {
    super(message, 403);
  }
}

// ============================================
// 2️⃣ VALIDATION ERRORS
// ============================================
export class ValidationError extends AppError {
  constructor(message, fields = {}) {
    super(message, 400);
    this.fields = fields; // For field-specific errors
  }
}

export class MissingFieldError extends AppError {
  constructor(fieldName) {
    super(`Required field missing: ${fieldName}`, 400);
    this.field = fieldName;
  }
}

export class InvalidInputError extends AppError {
  constructor(message = "Invalid input provided") {
    super(message, 400);
  }
}

export class InvalidEmailError extends AppError {
  constructor(message = "Invalid email address") {
    super(message, 400);
  }
}

export class InvalidPasswordError extends AppError {
  constructor(message = "Invalid password format") {
    super(message, 400);
  }
}

// ============================================
// 3️⃣ FILE UPLOAD ERRORS
// ============================================
export class FileUploadError extends AppError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}

export class FileValidationError extends AppError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}

export class FileSizeError extends AppError {
  constructor(message = "File size exceeds limit") {
    super(message, 400);
  }
}

export class FileTypeError extends AppError {
  constructor(message = "Invalid file type") {
    super(message, 400);
  }
}

export class CloudinaryError extends AppError {
  constructor(message, statusCode = 500) {
    super(message, statusCode);
  }
}

// ============================================
// 4️⃣ DATABASE ERRORS
// ============================================
export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
    this.resource = resource;
  }
}

export class DuplicateError extends AppError {
  constructor(field) {
    super(`${field} already exists`, 409);
    this.field = field;
  }
}

export class InvalidIdError extends AppError {
  constructor(message = "Invalid ID format") {
    super(message, 400);
  }
}

export class RecordNotFoundError extends AppError {
  constructor(model, id) {
    super(`${model} with ID ${id} not found`, 404);
    this.model = model;
    this.id = id;
  }
}

// ============================================
// 5️⃣ BUSINESS LOGIC ERRORS
// ============================================
export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409);
  }
}

export class InsufficientPermissionError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403);
  }
}

export class OperationNotAllowedError extends AppError {
  constructor(message = "Operation not allowed") {
    super(message, 403);
  }
}

export class ResourceExpiredError extends AppError {
  constructor(message = "Resource has expired") {
    super(message, 410);
  }
}

// ============================================
// 6️⃣ PAYMENT & TRANSACTION ERRORS
// ============================================
export class PaymentError extends AppError {
  constructor(message = "Payment processing failed") {
    super(message, 402);
  }
}

export class InsufficientFundsError extends AppError {
  constructor(message = "Insufficient funds") {
    super(message, 402);
  }
}

export class TransactionError extends AppError {
  constructor(message = "Transaction failed") {
    super(message, 500);
  }
}

// ============================================
// 7️⃣ EXTERNAL SERVICE ERRORS
// ============================================
export class ExternalServiceError extends AppError {
  constructor(service, message) {
    super(`${service} service error: ${message}`, 503);
    this.service = service;
  }
}

export class EmailServiceError extends AppError {
  constructor(message = "Email service unavailable") {
    super(message, 503);
  }
}

export class SMSServiceError extends AppError {
  constructor(message = "SMS service unavailable") {
    super(message, 503);
  }
}

// ============================================
// 8️⃣ RATE LIMITING & QUOTA ERRORS
// ============================================
export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429);
  }
}

export class QuotaExceededError extends AppError {
  constructor(message = "Quota exceeded") {
    super(message, 429);
  }
}

// ============================================
// 9️⃣ SESSION & STATE ERRORS
// ============================================
export class SessionExpiredError extends AppError {
  constructor(message = "Session has expired") {
    super(message, 401);
  }
}

export class InvalidStateError extends AppError {
  constructor(message = "Invalid state") {
    super(message, 400);
  }
}

// ============================================
// 🔟 NETWORK & TIMEOUT ERRORS
// ============================================
export class TimeoutError extends AppError {
  constructor(message = "Request timeout") {
    super(message, 408);
  }
}

export class NetworkError extends AppError {
  constructor(message = "Network error occurred") {
    super(message, 503);
  }
}

// ============================================
// 1️⃣1️⃣ CONFIGURATION & ENVIRONMENT ERRORS
// ============================================
export class ConfigurationError extends AppError {
  constructor(message = "Configuration error") {
    super(message, 500);
  }
}

export class EnvironmentError extends AppError {
  constructor(message = "Environment variable missing") {
    super(message, 500);
  }
}
