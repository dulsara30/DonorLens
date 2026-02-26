// Main NGO Request Page - Multi-step onboarding flow
// Orchestrates the 4-step verification request process
// Supports both NEW registration and RESUBMISSION workflows

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useNgoRequestForm from "../hooks/useNgoRequestForm";
import AuthHeader from "../components/auth/AuthHeader";
import React, { lazy, Suspense } from "react";
import { verifyResubmissionTokenAPI } from "../features/auth/api";

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

// Success modal component (updated for both new and resubmission)
const SuccessModal = ({ onClose, isResubmission }) => (
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

      {/* Success Message - Different based on mode */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          {isResubmission
            ? "Resubmission Successful!"
            : "Request Submitted Successfully!"}
        </h2>
        <p className="text-slate-600 leading-relaxed">
          {isResubmission
            ? "Thank you for resubmitting your NGO registration. Our verification team will review your updated information and documents."
            : "Thank you for submitting your NGO onboarding request. Our verification team will review your information and documents within 3-5 business days."}
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
              {isResubmission
                ? "Your updated information will be reviewed by our team."
                : "You'll receive a confirmation email within 2-3 business days."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">2.</span>
            <span>Our team will verify your documents</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">3.</span>
            <span>
              You'll be notified once your request is{" "}
              {isResubmission ? "re-reviewed" : "approved"}
            </span>
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
  const [searchParams] = useSearchParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Token verification states
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const token = searchParams.get("token");

  // Use custom hook for form state management
  const {
    currentStep,
    termsAgreed,
    basicInfo,
    documents,
    errors,
    isSubmitting,
    isResubmission,
    adminReviewNote,
    existingDocuments,
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
    prePopulateForm,
  } = useNgoRequestForm();

  /**
   * Effect: Verify resubmission token on mount if token present
   */
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        // No token = new registration flow
        console.log("📝 Starting new NGO registration");
        return;
      }

      // Token present = resubmission flow
      console.log("🔄 Resubmission token detected, verifying...");
      setIsVerifyingToken(true);
      setTokenError(null);

      try {
        const response = await verifyResubmissionTokenAPI(token);

        if (response.data?.success) {
          console.log("✅ Token verified successfully");
          const ngoData = response.data.data;

          // Pre-populate form with existing NGO data
          prePopulateForm(ngoData);
        } else {
          setTokenError(
            response.data?.message || "Invalid or expired resubmission link",
          );
        }
      } catch (error) {
        console.error("❌ Token verification failed:", error);
        setTokenError(
          error.response?.data?.message ||
            error.message ||
            "Failed to verify resubmission link. The link may have expired or already been used.",
        );
      } finally {
        setIsVerifyingToken(false);
      }
    };

    verifyToken();
  }, [token]); // Only run when token changes (on mount)

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

  // ============================================
  // LOADING STATE: Verifying Token
  // ============================================
  if (isVerifyingToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Verifying Resubmission Link
          </h2>
          <p className="text-slate-600">
            Please wait while we verify your token...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE: Invalid Token
  // ============================================
  if (tokenError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AuthHeader />
        <main className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-red-200">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">
                Invalid Resubmission Link
              </h2>

              <p className="text-slate-600 text-center mb-6">{tokenError}</p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">
                  Possible reasons:
                </h3>
                <ul className="space-y-1 text-sm text-amber-800 list-disc list-inside">
                  <li>The link has expired (valid for 24 hours)</li>
                  <li>The link has already been used</li>
                  <li>The link is invalid or corrupted</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors"
                >
                  Return to Home
                </button>
                <button
                  onClick={() => navigate("/register/ngo")}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  New Registration
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AuthHeader />

      {/* Main Content */}
      <main className="py-8 px-4 md:py-12">
        {/* Admin Review Note Banner (Resubmission Mode Only) */}
        {isResubmission && adminReviewNote && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    📝 Admin Review - Changes Requested
                  </h3>
                  <p className="text-amber-800 leading-relaxed mb-3">
                    Our verification team has reviewed your registration and
                    requested the following updates:
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <p className="text-slate-700 italic">{adminReviewNote}</p>
                  </div>
                  <p className="text-sm text-amber-700 mt-3">
                    Please update your information according to the feedback
                    above and resubmit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Title - Different for resubmission */}
        {isResubmission && (
          <div className="max-w-4xl mx-auto mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Update Your NGO Registration
            </h1>
            <p className="text-slate-600">
              Review and update your information based on admin feedback
            </p>
          </div>
        )}

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
                isResubmission={isResubmission}
                adminReviewNote={adminReviewNote}
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
                isResubmission={isResubmission}
                existingDocuments={existingDocuments}
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
                isResubmission={isResubmission}
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
      {showSuccessModal && (
        <SuccessModal
          onClose={handleCloseModal}
          isResubmission={isResubmission}
        />
      )}
    </div>
  );
};

export default NgoRequestPage;
