/**
 * Standardized API Response Helper
 * Provides consistent response structure across all endpoints
 */

export class ApiResponse {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {Object} options - Response options
   * @param {number} options.statusCode - HTTP status code (default: 200)
   * @param {string} options.message - Success message
   * @param {*} options.data - Response data
   * @param {Object} options.meta - Optional metadata (pagination, etc.)
   */
  static success(res, { statusCode = 200, message, data, meta }) {
    const response = {
      success: true,
      message: message || "Request successful",
    };

    // Add data if provided
    if (data !== undefined) {
      response.data = data;
    }

    // Add metadata if provided (for pagination, etc.)
    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send created response (201)
   * @param {Object} res - Express response object
   * @param {Object} options - Response options
   */
  static created(res, { message, data, meta }) {
    return this.success(res, {
      statusCode: 201,
      message: message || "Resource created successfully",
      data,
      meta,
    });
  }

  /**
   * Send no content response (204)
   * @param {Object} res - Express response object
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Send paginated response
   * @param {Object} res - Express response object
   * @param {Object} options - Response options
   */
  static paginated(res, { data, page, limit, total, message }) {
    const totalPages = Math.ceil(total / limit);

    return this.success(res, {
      statusCode: 200,
      message: message || "Data retrieved successfully",
      data,
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }
}

/**
 * Shorthand functions for common responses
 */

export const sendSuccess = (res, data, message = "Success") => {
  return ApiResponse.success(res, { data, message });
};

export const sendCreated = (res, data, message = "Created successfully") => {
  return ApiResponse.created(res, { data, message });
};

export const sendNoContent = (res) => {
  return ApiResponse.noContent(res);
};

export const sendPaginated = (res, options) => {
  return ApiResponse.paginated(res, options);
};
