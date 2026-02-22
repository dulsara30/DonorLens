import { FileValidationError } from "../utils/errors.js";
import { FILE_SIZE_LIMITS, getFileCategory } from "../utils/fileHelpers.js";

export const validateFiles = (options = {}) => {
  // Fixed typo: validatteFiles → validateFiles
  return (req, res, next) => {
    try {
      // Handle different multer configurations
      let filesArray = [];

      if (req.files) {
        // When using uploadFields(), req.files is an object like:
        // { registrationCertificate: [file], additionalDoc1: [file] }
        if (Array.isArray(req.files)) {
          // uploadArray() or uploadAny() returns an array
          filesArray = req.files;
        } else {
          // uploadFields() returns an object, convert to array
          filesArray = Object.values(req.files).flat();
        }
      } else if (req.file) {
        // uploadSingle() returns a single file
        filesArray = [req.file];
      }

      console.log("Files to validate:", filesArray.length);

      // Check minimum files requirement
      if (options.minFiles && filesArray.length < options.minFiles) {
        throw new FileValidationError(
          `At least ${options.minFiles} file(s) required`,
        );
      }

      // Check maximum files limit
      if (options.maxFiles && filesArray.length > options.maxFiles) {
        throw new FileValidationError(
          `Maximum ${options.maxFiles} file(s) allowed`,
        );
      }

      // Validate each file
      filesArray.forEach((file, index) => {
        // Check file type if specified
        if (
          options.allowedTypes &&
          !options.allowedTypes.includes(file.mimetype)
        ) {
          throw new FileValidationError(
            `File ${index + 1} (${file.originalname}) has an invalid file type. Allowed types: ${options.allowedTypes.join(", ")}`,
          );
        }

        // Check file size
        const category = getFileCategory(file.mimetype);
        const maxSize =
          options.maxSize ||
          FILE_SIZE_LIMITS[category] ||
          FILE_SIZE_LIMITS.default;

        if (file.size > maxSize) {
          throw new FileValidationError(
            `File ${index + 1} (${file.originalname}) exceeds maximum size of ${maxSize / (1024 * 1024)}MB`,
          );
        }
      });

      // Attach file metadata to request for later use
      req.fileMetadata = {
        count: filesArray.length,
        totalSize: filesArray.reduce((sum, file) => sum + file.size, 0),
        types: [...new Set(filesArray.map((f) => getFileCategory(f.mimetype)))],
      };

      next();
    } catch (error) {
      console.error("File validation error:", error);
      next(error);
    }
  };
};
