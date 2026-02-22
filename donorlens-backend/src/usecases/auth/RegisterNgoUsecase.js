// Business logic for NGO admin registration

import User from "../../models/user/User.js";
import {
  DuplicateError,
  InvalidEmailError,
  InvalidInputError,
  ValidationError,
} from "../../utils/errors.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";
import emailService from "../../services/email.service.js";

/**
 * Register NGO Admin Usecase - Handles NGO administrator registration business logic
 * @param {Object} userData - NGO admin registration data
 * @param {string} userData.fullName - Admin's full name
 * @param {string} userData.email - Admin's email address
 * @param {string} userData.ngoName - Name of the NGO organization
 * @param {string} userData.registrationNumber - NGO registration number
 * @param {string} userData.primaryPhone - Primary contact number
 * @param {string} userData.secondaryPhone - Secondary contact number (optional)
 * @param {string} userData.website - NGO website URL (optional)
 * @param {string} userData.address - NGO address
 * @param {string} userData.description - NGO description
 * @param {Object} files - Uploaded files from multer
 * @param {Array} files.registrationCertificate - Registration certificate file
 * @param {Array} files.additionalDoc1 - Additional document 1 (optional)
 * @param {Array} files.additionalDoc2 - Additional document 2 (optional)
 * @param {Array} files.additionalDoc3 - Additional document 3 (optional)
 * @returns {Object} User data (safe object without sensitive info)
 * @throws {ValidationError} When required fields are missing
 * @throws {InvalidEmailError} When email format is invalid
 * @throws {InvalidInputError} When input validation fails
 * @throws {DuplicateError} When email already exists
 */
export default async function RegisterNgoUsecase(userData, files) {
  const {
    fullName,
    email,
    ngoName,
    registrationNumber,
    primaryPhone,
    secondaryPhone,
    description,
    website,
    address,
  } = userData;

  const errors = {};

  if (!fullName?.trim()) errors.fullName = "Full name is required";
  if (!email?.trim()) errors.email = "Email is required";
  if (!ngoName?.trim()) errors.ngoName = "NGO name is required";
  if (!primaryPhone?.trim()) errors.primaryPhone = "Primary phone is required";
  if (!address?.trim()) errors.address = "Address is required";
  if (!description?.trim()) errors.description = "Description is required";
  if (!registrationNumber?.trim()) {
    errors.registrationNumber = "Registration number is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Missing required fields", errors);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new InvalidEmailError("Please provide a valid email address");
  }

  const phoneDigits = primaryPhone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    throw new InvalidInputError(
      "Primary phone number must be at least 10 digits",
    );
  }

  if (address.trim().length < 10) {
    throw new InvalidInputError("Address must be at least 10 characters long");
  }

  if (website && website.trim() !== "") {
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(website)) {
      throw new InvalidInputError("Invalid website URL format");
    }
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new DuplicateError("Email");
  }

  let uploadedDocuments = {
    registrationCertificate: null,
    additionalDocuments: [],
  };

  // Upload registration certificate (required)
  if (files.registrationCertificate && files.registrationCertificate[0]) {
    const certFile = files.registrationCertificate[0];
    const uploadedCert = await uploadToCloudinary(certFile.buffer, {
      folder: "donorlens/ngo-registrations/certificates",
      originalName: certFile.originalname,
      resourceType: certFile.mimetype.startsWith("image/") ? "image" : "raw",
    });

    uploadedDocuments.registrationCertificate = {
      url: uploadedCert.url,
      publicId: uploadedCert.publicId,
      format: uploadedCert.format,
      size: uploadedCert.bytes,
    };
  }

  // Upload additional documents (optional)
  const additionalDocFields = [
    "additionalDoc1",
    "additionalDoc2",
    "additionalDoc3",
  ];

  for (const fieldName of additionalDocFields) {
    if (files[fieldName] && files[fieldName][0]) {
      const docFile = files[fieldName][0];
      const uploadedDoc = await uploadToCloudinary(docFile.buffer, {
        folder: "donorlens/ngo-registrations/additional-docs",
        originalName: docFile.originalname,
        resourceType: docFile.mimetype.startsWith("image/") ? "image" : "raw",
      });

      uploadedDocuments.additionalDocuments.push({
        url: uploadedDoc.url,
        publicId: uploadedDoc.publicId,
        format: uploadedDoc.format,
        size: uploadedDoc.bytes,
      });
    }
  }

  const newNgoAdmin = new User({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    role: "NGO_ADMIN",
    isActive: false,
    ngoDetails: {
      ngoName: ngoName.trim(),
      registrationNumber: registrationNumber.trim(),
      primaryPhone: primaryPhone.trim(),
      secondaryPhone: secondaryPhone?.trim() || undefined,
      description: description.trim(),
      website: website?.trim() || undefined,
      address: address.trim(),
      documents: uploadedDocuments,
      status: "PENDING",
      submissionHistory: [
        {
          submittedAt: new Date(),
          status: "PENDING",
          documents: uploadedDocuments,
        },
      ],
    },
  });

  await newNgoAdmin.save();

  try {
    await emailService.sendNgoRegistrationReceived({
      email: newNgoAdmin.email,
      ngoName: newNgoAdmin.ngoDetails.ngoName,
      fullName: newNgoAdmin.fullName,
    });
    console.log("Registration confirmation email sent to:", newNgoAdmin.email);
  } catch (emailError) {
    console.error("Failed to send registration email:", emailError.message);
  }

  return newNgoAdmin.toSafeObject();
}
