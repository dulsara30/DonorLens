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
      accessMode = "public",
      transformation = [],
    } = options;

    // Generate unique filename (keeps extension for proper URLs)
    const uniqueFilename = generateUniqueFilename(originalName);

    const isPdf = originalName.toLowerCase().endsWith(".pdf");

    const actualResourceType = isPdf ? "image" : resourceType;

    // Upload to Cloudinary using upload_stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: uniqueFilename, // Keeps extension for raw files
          resource_type: actualResourceType, // 'image', 'raw', 'video', or 'auto'
          transformation: transformation,
          access_mode: accessMode, // 'public' or 'authenticated'
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          // Only apply format optimization for images

          // ✅ PDF-specific configuration
          ...(isPdf && {
            format: "pdf", // Keep as PDF
            flags: "attachment:false", // Allow preview, not forced download
            pages: true, // Enable page extraction
          }),

          ...(resourceType === "image" &&
            !isPdf && {
              format: "webp",
              quality: "auto:good",
              fetch_format: "auto",
            }),
        },
        (error, result) => {
          if (error) {
            reject(
              new CloudinaryError(`Cloudinary upload failed: ${error.message}`),
            );
          } else {
            const previewUrl = isPdf
              ? generatePdfPreviewUrl(result.secure_url)
              : result.secure_url;

            resolve({
              url: result.secure_url,
              previewUrl: previewUrl,
              publicId: result.public_id,
              format: result.format,
              resourceType: result.resource_type,
              bytes: result.bytes,
              width: result.width,
              height: result.height,
              createdAt: result.created_at,
              isPdf: isPdf,
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
 * ✅ NEW: Generate PDF preview URL using Cloudinary transformations
 * Converts PDF to image for browser preview
 *
 * @param {String} pdfUrl - Original Cloudinary PDF URL
 * @param {Number} page - Page number to preview (default: 1)
 * @returns {String} Preview URL
 */
export const generatePdfPreviewUrl = (pdfUrl, page = 1) => {
  if (!pdfUrl || !pdfUrl.includes("cloudinary.com")) {
    return pdfUrl;
  }

  try {
    // Transform Cloudinary URL to generate image preview
    // Example: /image/upload/v123/file.pdf
    // Becomes: /image/upload/f_jpg,pg_1,q_auto,w_1200/v123/file.pdf

    const transformations = [
      `f_jpg`, // Convert to JPG
      `pg_${page}`, // Specific page
      `q_auto:good`, // Auto quality (good level)
      `w_1200`, // Max width 1200px
      `dpr_auto`, // Device pixel ratio auto
    ].join(",");

    // Insert transformations after /upload/
    const previewUrl = pdfUrl.replace(
      "/upload/",
      `/upload/${transformations}/`,
    );

    return previewUrl;
  } catch (error) {
    console.error("Error generating PDF preview URL:", error);
    return pdfUrl;
  }
};

/**
 * ✅ NEW: Generate direct download URL
 * Forces browser to download instead of preview
 *
 * @param {String} fileUrl - Original Cloudinary URL
 * @returns {String} Download URL
 */
export const generateDownloadUrl = (fileUrl) => {
  if (!fileUrl || !fileUrl.includes("cloudinary.com")) {
    return fileUrl;
  }

  try {
    // Add fl_attachment flag to force download
    const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");

    return downloadUrl;
  } catch (error) {
    console.error("Error generating download URL:", error);
    return fileUrl;
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

      const isPdf = file.originalname.toLowerCase().endsWith(".pdf");

      // ✅ PDFs uploaded as "image" for transformation support
      const resourceType = category === "image" || isPdf ? "image" : "raw";

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
