// Custom hook for managing NGO request form state across multiple steps
// Handles form data, validation, navigation between steps, and document uploads
// Supports both NEW registration and RESUBMISSION workflows

import { useState } from "react";
import {
  submitNgoRequest,
  resubmitNgoRegistrationAPI,
} from "../features/auth/api";

const useNgoRequestForm = () => {
  // Current step state (1-4)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Terms agreement
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Step 2: Basic NGO information
  const [basicInfo, setBasicInfo] = useState({
    ngoName: "",
    registrationNumber: "",
    address: "",
    description: "",
    officialEmail: "",
    primaryPhone: "",
    secondaryPhone: "",
    website: "",
  });

  // Step 3: Document uploads
  const [documents, setDocuments] = useState({
    registrationCertificate: null,
    additionalDocs: [], // Array of up to 3 additional documents
  });

  // Validation errors for each field
  const [errors, setErrors] = useState({});

  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================
  // RESUBMISSION MODE SPECIFIC STATE
  // ============================================
  const [isResubmission, setIsResubmission] = useState(false);
  const [ngoId, setNgoId] = useState(null);
  const [adminReviewNote, setAdminReviewNote] = useState(null);
  const [existingDocuments, setExistingDocuments] = useState(null);

  // Update basic info field
  const updateBasicInfo = (field, value) => {
    setBasicInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format (basic - at least 10 digits)
  const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  // Validate URL format
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate Step 2 fields
  const validateStep2 = () => {
    const newErrors = {};

    // Required fields
    if (!basicInfo.ngoName.trim()) {
      newErrors.ngoName = "NGO name is required";
    } else if (basicInfo.ngoName.trim().length < 3) {
      newErrors.ngoName = "NGO name must be at least 3 characters";
    }

    if (!basicInfo.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }

    if (!basicInfo.address.trim()) {
      newErrors.address = "Address is required";
    } else if (basicInfo.address.trim().length < 10) {
      newErrors.address = "Please provide a complete address";
    }

    if (!basicInfo.description.trim()) {
      newErrors.description = "Description is required";
    } else if (basicInfo.description.trim().length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!basicInfo.officialEmail.trim()) {
      newErrors.officialEmail = "Official email is required";
    } else if (!isValidEmail(basicInfo.officialEmail)) {
      newErrors.officialEmail = "Please enter a valid email address";
    }

    if (!basicInfo.primaryPhone.trim()) {
      newErrors.primaryPhone = "Primary phone is required";
    } else if (!isValidPhone(basicInfo.primaryPhone)) {
      newErrors.primaryPhone = "Please enter a valid phone number";
    }

    // Optional fields validation
    if (
      basicInfo.secondaryPhone.trim() &&
      !isValidPhone(basicInfo.secondaryPhone)
    ) {
      newErrors.secondaryPhone = "Please enter a valid phone number";
    }

    if (basicInfo.website.trim() && !isValidUrl(basicInfo.website)) {
      newErrors.website =
        "Please enter a valid URL (e.g., https://example.org)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3 - documents
  const validateStep3 = () => {
    const newErrors = {};

    if (!documents.registrationCertificate) {
      newErrors.registrationCertificate =
        "Registration certificate is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload registration certificate
  const uploadRegistrationCertificate = (file) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        registrationCertificate: "Only PDF, JPG, and PNG files are allowed",
      }));
      return false;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        registrationCertificate: "File size must be less than 5MB",
      }));
      return false;
    }

    setDocuments((prev) => ({
      ...prev,
      registrationCertificate: file,
    }));

    // Clear error
    if (errors.registrationCertificate) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.registrationCertificate;
        return newErrors;
      });
    }

    return true;
  };

  // Remove registration certificate
  const removeRegistrationCertificate = () => {
    setDocuments((prev) => ({
      ...prev,
      registrationCertificate: null,
    }));
  };

  // Add additional document (max 3)
  const addAdditionalDocument = (file) => {
    if (documents.additionalDocs.length >= 3) {
      setErrors((prev) => ({
        ...prev,
        additionalDocs: "Maximum 3 additional documents allowed",
      }));
      return false;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        additionalDocs: "Only PDF, JPG, and PNG files are allowed",
      }));
      return false;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        additionalDocs: "File size must be less than 5MB",
      }));
      return false;
    }

    setDocuments((prev) => ({
      ...prev,
      additionalDocs: [...prev.additionalDocs, file],
    }));

    // Clear error
    if (errors.additionalDocs) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.additionalDocs;
        return newErrors;
      });
    }

    return true;
  };

  // Remove additional document by index
  const removeAdditionalDocument = (index) => {
    setDocuments((prev) => ({
      ...prev,
      additionalDocs: prev.additionalDocs.filter((_, i) => i !== index),
    }));
  };

  // ============================================
  // RESUBMISSION SPECIFIC FUNCTIONS
  // ============================================

  /**
   * Pre-populate form with existing NGO data for resubmission
   * @param {Object} ngoData - NGO user data from backend
   */
  const prePopulateForm = (ngoData) => {
    console.log("🔄 Pre-populating form with existing NGO data:", ngoData);

    setIsResubmission(true);
    setNgoId(ngoData._id);

    // Set basic info from existing data
    setBasicInfo({
      ngoName: ngoData.ngoDetails?.ngoName || "",
      registrationNumber: ngoData.ngoDetails?.registrationNumber || "",
      address: ngoData.ngoDetails?.address || "",
      description: ngoData.ngoDetails?.description || "",
      officialEmail: ngoData.email || "",
      primaryPhone: ngoData.ngoDetails?.primaryPhone || "",
      secondaryPhone: ngoData.ngoDetails?.secondaryPhone || "",
      website: ngoData.ngoDetails?.website || "",
    });

    // Store existing documents reference (for display, not upload)
    if (ngoData.ngoDetails?.documents) {
      setExistingDocuments(ngoData.ngoDetails.documents);
    }

    // Get latest review note (admin's reason for resubmission)
    if (
      ngoData.ngoDetails?.reviewNotes &&
      ngoData.ngoDetails.reviewNotes.length > 0
    ) {
      const latestNote =
        ngoData.ngoDetails.reviewNotes[
          ngoData.ngoDetails.reviewNotes.length - 1
        ];
      setAdminReviewNote(latestNote.note);
    }

    // Auto-check terms for resubmission (they already agreed before)
    setTermsAgreed(true);

    // Start from step 2 (skip terms) for resubmission
    setCurrentStep(2);

    console.log("✅ Form pre-populated successfully");
  };

  // Navigate to next step
  const goToNextStep = () => {
    // Validate current step before proceeding
    let canProceed = true;

    if (currentStep === 1) {
      canProceed = termsAgreed;
    } else if (currentStep === 2) {
      canProceed = validateStep2();
    } else if (currentStep === 3) {
      canProceed = validateStep3();
    }

    if (canProceed && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return canProceed;
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Jump to specific step (from preview page)
  const goToStep = (step) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Submit the complete form
  const submitForm = async () => {
    setIsSubmitting(true);

    try {
      // Prepare form data for submission
      const formData = new FormData();

      // Add basic info fields
      Object.keys(basicInfo).forEach((key) => {
        if (basicInfo[key]) {
          formData.append(key, basicInfo[key]);
        }
      });

      // ============================================
      // RESUBMISSION MODE: Add ngoId
      // ============================================
      if (isResubmission && ngoId) {
        formData.append("ngoId", ngoId);
        console.log("📤 Resubmitting for NGO ID:", ngoId);
      }

      // Add registration certificate (required)
      if (documents.registrationCertificate) {
        formData.append(
          "registrationCertificate",
          documents.registrationCertificate,
        );
      }

      // Add additional documents (optional)
      documents.additionalDocs.forEach((doc, index) => {
        formData.append(`additionalDoc${index + 1}`, doc);
      });

      console.log("Submitting form with data:", {
        basicInfo,
        documents,
        isResubmission,
        ngoId,
      });

      // ============================================
      // Choose API based on mode
      // ============================================
      const response = isResubmission
        ? await resubmitNgoRegistrationAPI(formData)
        : await submitNgoRequest(formData);

      console.log(
        `${isResubmission ? "🔄 Resubmission" : "📝 Initial submission"} response:`,
        response,
      );

      if (!response.success && !response.data?.success) {
        return {
          success: false,
          error: response.message || "Submission failed.",
        };
      }

      setIsSubmitting(false);
      return {
        success: true,
        data: response,
        isResubmission,
      };
    } catch (error) {
      console.error("NGO Request submission error:", error);
      setIsSubmitting(false);

      return {
        success: false,
        error:
          error.message || "Failed to submit NGO request. Please try again.",
      };
    }
  };

  // Reset entire form
  const resetForm = () => {
    setCurrentStep(1);
    setTermsAgreed(false);
    setBasicInfo({
      ngoName: "",
      registrationNumber: "",
      address: "",
      description: "",
      officialEmail: "",
      primaryPhone: "",
      secondaryPhone: "",
      website: "",
    });
    setDocuments({
      registrationCertificate: null,
      additionalDocs: [],
    });
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    // State
    currentStep,
    termsAgreed,
    basicInfo,
    documents,
    errors,
    isSubmitting,

    // Resubmission state
    isResubmission,
    ngoId,
    adminReviewNote,
    existingDocuments,

    // Actions
    setTermsAgreed,
    updateBasicInfo,
    uploadRegistrationCertificate,
    removeRegistrationCertificate,
    addAdditionalDocument,
    removeAdditionalDocument,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    submitForm,
    resetForm,

    // Resubmission actions
    prePopulateForm,

    // Validation helpers
    validateStep2,
    validateStep3,
  };
};

export default useNgoRequestForm;
