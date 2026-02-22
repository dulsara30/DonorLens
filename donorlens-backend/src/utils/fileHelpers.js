export const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  all: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024,
  document: 10 * 1024 * 1024,
  default: 5 * 1024 * 1024,
};

export const getFileCategory = (mimetype) => {
  if (ALLOWED_FILE_TYPES.images.includes(mimetype)) {
    return "image";
  }
  if (ALLOWED_FILE_TYPES.documents.includes(mimetype)) {
    return "document";
  }
  return "unknown";
};

export const getFileExtension = (filename) => {
  return filename.split(".").pop().toLowerCase();
};

export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = getFileExtension(originalName);
  return `${timestamp}-${randomString}.${fileExtension}`;
};
