// Main NGO Request Page - Multi-step onboarding flow
// Orchestrates the 4-step verification request process

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useNgoRequestForm from "../hooks/useNgoRequestForm";
import AuthHeader from "../components/auth/AuthHeader";
import React, { lazy, Suspense } from "react";

// Step components

const StepIndicator = lazy(
  () => import("../components/ngoRequest/StepIndicator"),
);
const StepOneIntent = lazy(
  () => import("../components/ngoRequest/StepOneIntent"),
);
const StepTwoBasicInfo = lazy(
  () => import("../components/ngoRequest/StepTwoBasicInfo"),
);
const StepThreeDocuments = lazy(
  () => import("../components/ngoRequest/StepThreeDocuments"),
);
const StepFourPreview = lazy(
  () => import("../components/ngoRequest/StepFourPreview"),
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    <span className="ml-3 text-slate-600">Loading step...</span>
  </div>
);

// Success modal component
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-in-up">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="#14b8a6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Request Submitted Successfully!
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Thank you for submitting your NGO onboarding request. Our verification
          team will review your information and documents within{" "}
          <strong>3-5 business days</strong>.
        </p>
      </div>

      {/* Next Steps */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-teal-900 mb-2">
          What happens next?
        </h3>
        <ul className="space-y-1 text-sm text-teal-800">
          <li className="flex items-start gap-2">
            <span className="font-semibold">1.</span>
            <span>
              You'll receive a confirmation email within 2-3 business days.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">2.</span>
            <span>
              You can track your request status in the "My Requests" section of
              your dashboard.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">3.</span>
            <span>Our team will verify your documents</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">4.</span>
            <span>You'll be notified once approved</span>
          </li>
        </ul>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 shadow-md hover:shadow-lg transition-all duration-200"
      >
        Return to Home
      </button>
    </div>
  </div>
);

const NgoRequestPage = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Use custom hook for form state management
  const {
    currentStep,
    termsAgreed,
    basicInfo,
    documents,
    errors,
    isSubmitting,
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
  } = useNgoRequestForm();

  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission if called from a form element
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const result = await submitForm();

    console.log("Form submission result:", result);

    if (result.success) {
      setShowSuccessModal(true);
    } else {
      // Handle error - show error message to user
      const errorMessage =
        result.error || "Failed to submit request. Please try again.";
      alert(`Submission failed: ${errorMessage}`);
      console.error("Form submission error:", result.error);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AuthHeader />

      {/* Main Content */}
      <main className="py-8 px-4 md:py-12">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}

        <div className="mt-8">
          <Suspense fallback={<LoadingSpinner />}>
            {currentStep === 1 && (
              <StepOneIntent
                termsAgreed={termsAgreed}
                setTermsAgreed={setTermsAgreed}
                onNext={goToNextStep}
              />
            )}
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            {currentStep === 2 && (
              <StepTwoBasicInfo
                basicInfo={basicInfo}
                updateBasicInfo={updateBasicInfo}
                errors={errors}
                onNext={goToNextStep}
                onPrevious={goToPreviousStep}
              />
            )}
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            {currentStep === 3 && (
              <StepThreeDocuments
                registrationCertificate={documents.registrationCertificate}
                additionalDocs={documents.additionalDocs}
                uploadRegistrationCertificate={uploadRegistrationCertificate}
                removeRegistrationCertificate={removeRegistrationCertificate}
                addAdditionalDocument={addAdditionalDocument}
                removeAdditionalDocument={removeAdditionalDocument}
                errors={errors}
                onNext={goToNextStep}
                onPrevious={goToPreviousStep}
              />
            )}
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            {currentStep === 4 && (
              <StepFourPreview
                basicInfo={basicInfo}
                registrationCertificate={documents.registrationCertificate}
                additionalDocs={documents.additionalDocs}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onEditStep={goToStep}
              />
            )}
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2026 DonorLens. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:support@donorlens.org"
                className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
              >
                Need Help?
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="/terms-privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
              >
                Terms &amp; Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal onClose={handleCloseModal} />}
    </div>
  );
};

export default NgoRequestPage;
