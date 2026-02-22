// Step 1: Intent & Terms Agreement
// Explains the verification process and collects user consent

import { Link } from 'react-router-dom';

const StepOneIntent = ({ termsAgreed, setTermsAgreed, onNext }) => {
  const handleContinue = () => {
    if (termsAgreed) {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-sm font-semibold mb-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Verification Required
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          NGO Onboarding Request
        </h1>
        <p className="text-lg text-slate-600">
          We verify all NGOs to maintain trust and transparency on our platform
        </p>
      </div>

      {/* Main content card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6">
        {/* Why Verification Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            Why We Verify NGOs
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            At DonorLens, we believe in building trust through transparency. Every NGO on our
            platform goes through a <strong>thorough verification process</strong> to ensure
            legitimacy and accountability. Your organization will be carefully reviewed by our
            team before being approved to create campaigns.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-700">Our Commitment:</strong> Verified NGOs build
              confidence with donors, prevent fraud, and ensure all funds reach legitimate
              causes. Your participation in this verification process demonstrates your
              commitment to transparency and accountability.
            </p>
          </div>
        </div>

        {/* What You'll Need Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 11L12 14L22 4"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            What You'll Need
          </h2>
          <p className="text-slate-700 mb-4">
            Please have the following information and documents ready:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-700">
              <svg
                className="shrink-0 mt-1"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="#14b8a6" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="#14b8a6" />
              </svg>
              <span>
                <strong className="text-slate-900">Basic NGO Information:</strong> Name,
                registration number, address, contact details, and a brief description
              </span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <svg
                className="shrink-0 mt-1"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="#14b8a6" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="#14b8a6" />
              </svg>
              <span>
                <strong className="text-slate-900">Registration Certificate:</strong>{' '}
                Official NGO registration document (PDF, JPG, or PNG, max 5MB)
              </span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <svg
                className="shrink-0 mt-1"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="#14b8a6" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="#14b8a6" />
              </svg>
              <span>
                <strong className="text-slate-900">Additional Documents</strong>{' '}
                <span className="text-slate-500">(optional):</span> Tax exemption
                certificates, annual reports, or other credentials (up to 3 files)
              </span>
            </li>
          </ul>
        </div>

        {/* Timeline Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" />
                <path
                  d="M12 6V12L16 14"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            What Happens Next?
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900 leading-relaxed">
              After you submit your request, our verification team will review your
              information within <strong>3-5 business days</strong>. You'll receive an
              email notification once your NGO is approved and you can start creating
              campaigns.
            </p>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="border-t border-slate-200 pt-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer"
            />
            <span className="text-slate-700 leading-relaxed select-none">
              I confirm that I have the authority to represent this NGO and that all
              information provided will be accurate and truthful. I have read and agree to
              the{' '}
              <Link
                to="/terms-privacy"
                target="_blank"
                className="text-teal-600 hover:text-teal-700 underline font-medium"
              >
                Terms &amp; Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="px-6 py-2.5 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleContinue}
          disabled={!termsAgreed}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            termsAgreed
              ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue to Basic Info
        </button>
      </div>
    </div>
  );
};

export default StepOneIntent;
