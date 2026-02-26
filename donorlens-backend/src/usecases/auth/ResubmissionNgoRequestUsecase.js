import User from "../../models/user/User.js";
import {
  InvalidEmailError,
  InvalidInputError,
  ValidationError,
} from "../../utils/errors.js";

import { uploadToCloudinary } from "../../services/cloudinary.service.js";

export default async function ResubmissionNgoRequestUsecase(userData, files) {
  try {
    console.log("Updating NGO request...");

    const {
      ngoId,
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

    if (!ngoId?.trim()) errors.ngoId = "NGO ID is required";
    if (!fullName?.trim()) errors.fullName = "Full name is required";
    if (!email?.trim()) errors.email = "Email is required";
    if (!ngoName?.trim()) errors.ngoName = "NGO name is required";
    if (!primaryPhone?.trim())
      errors.primaryPhone = "Primary phone is required";
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
      throw new InvalidInputError(
        "Address must be at least 10 characters long",
      );
    }

    if (website && website.trim() !== "") {
      const urlRegex =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(website)) {
        throw new InvalidInputError("Invalid website URL format");
      }
    }

    const ngoUser = await User.findById(ngoId.toString());
    if (!ngoUser) {
      throw new ValidationError("NGO user not found");
    }

    if (ngoUser.role !== "NGO_ADMIN") {
      throw new ValidationError("User is not an NGO admin");
    }

    if (ngoUser.ngoDetails.status === "APPROVED") {
      throw new ValidationError("NGO is already approved");
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

    ngoUser.fullName = ngoName.trim();
    ngoUser.email = email.toLowerCase().trim();
    ngoUser.role = "NGO_ADMIN";
    ngoUser.passwordHash = null; // Clear password to force reset
    ngoUser.isActive = false;
    ngoUser.ngoDetails = {
      ngoName: ngoName.trim(),
      registrationNumber: registrationNumber.trim(),
      primaryPhone: primaryPhone.trim(),
      secondaryPhone: secondaryPhone?.trim() || "",
      description: description.trim(),
      website: website?.trim() || "",
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
      passwordSetupToken: null,
      passwordSetupTokenExpiry: null,
      passwordSetupTokenUsed: false,
      resubmissionToken: null,
      resubmissionTokenExpiry: null,
      resubmissionTokenUsed: false,
    };

    await ngoUser.save();
    return {
      success: true,
      message:
        "NGO registration resubmission successful. Awaiting admin review.",
      data: ngoUser,
    };
  } catch (error) {
    console.error("Error in ResubmissionNgoRequestUsecase:", error);
    throw error;
  }
}
