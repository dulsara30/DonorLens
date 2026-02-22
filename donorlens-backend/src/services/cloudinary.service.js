import cloudinary from "../config/cloudinary.config.js";
import { CloudinaryError } from "../utils/errors.js";
import {
  generateUniqueFilename,
  getFileCategory,
} from "../utils/fileHelpers.js";

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {Object} options - Upload options
 * @param {String} options.folder - Cloudinary folder path
 * @param {String} options.originalName - Original filename
 * @param {String} options.resourceType - 'image', 'raw', or 'auto'
 * @returns {Promise<Object>} Upload result with URL and public_id
 */
export const uploadToCloudinary = async (fileBuffer, options = {}) => {
  try {
    const {
      folder = "donorlens",
      originalName = "file",
      resourceType = "auto",
      transformation = [],
    } = options;

    // Generate unique filename (keeps extension for proper URLs)
    const uniqueFilename = generateUniqueFilename(originalName);

    // Upload to Cloudinary using upload_stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: uniqueFilename, // Keeps extension for raw files
          resource_type: resourceType, // 'image', 'raw', 'video', or 'auto'
          transformation: transformation,
          use_filename: true,
          unique_filename: false,
          // Only apply format optimization for images
          ...(resourceType === "image" && {
            format: "webp",
            quality: "auto",
            fetch_format: "auto",
          }),
        },
        (error, result) => {
          if (error) {
            reject(
              new CloudinaryError(`Cloudinary upload failed: ${error.message}`),
            );
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              resourceType: result.resource_type,
              bytes: result.bytes,
              width: result.width,
              height: result.height,
              createdAt: result.created_at,
            });
          }
        },
      );

      // Write buffer to stream
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new CloudinaryError(`Upload to Cloudinary failed: ${error.message}`);
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of files from multer
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadMultipleToCloudinary = async (
  files,
  folder = "donorlens",
) => {
  try {
    const uploadPromises = files.map((file) => {
      const category = getFileCategory(file.mimetype);
      const resourceType = category === "image" ? "image" : "raw";

      return uploadToCloudinary(file.buffer, {
        folder: `${folder}/${category}s`, // e.g., donorlens/images, donorlens/documents
        originalName: file.originalname,
        resourceType: resourceType,
      });
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new CloudinaryError(`Multiple file upload failed: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public_id
 * @param {String} resourceType - 'image' or 'raw'
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image",
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result !== "ok") {
      throw new CloudinaryError(`Failed to delete file: ${publicId}`);
    }

    return result;
  } catch (error) {
    throw new CloudinaryError(`Cloudinary deletion failed: ${error.message}`);
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array} publicIds - Array of public_ids
 * @param {String} resourceType - 'image' or 'raw'
 * @returns {Promise<Array>} Array of deletion results
 */
export const deleteMultipleFromCloudinary = async (
  publicIds,
  resourceType = "image",
) => {
  try {
    const deletePromises = publicIds.map((publicId) =>
      deleteFromCloudinary(publicId, resourceType),
    );

    return await Promise.all(deletePromises);
  } catch (error) {
    throw new CloudinaryError(
      `Multiple file deletion failed: ${error.message}`,
    );
  }
};
