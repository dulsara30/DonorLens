// Custom hook for managing NGO request form state across multiple steps
// Handles form data, validation, navigation between steps, and document uploads

import { useState } from "react";
import { submitNgoRequest } from "../features/auth/api";

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
      });
      // Submit to backend API
      const response = await submitNgoRequest(formData);

      console.log("NGO Request submission response:", response);

      setIsSubmitting(false);
      return {
        success: true,
        data: response,
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

    // Validation helpers
    validateStep2,
    validateStep3,
  };
};

export default useNgoRequestForm;
