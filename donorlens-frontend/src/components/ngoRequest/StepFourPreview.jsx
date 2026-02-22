// Step 4: Preview & Confirm
// Shows all collected information for review before submission

const StepFourPreview = ({
  basicInfo,
  registrationCertificate,
  additionalDocs,
  isSubmitting,
  onSubmit,
  onEditStep
}) => {
  const handleSubmit = async () => {
    await onSubmit();
    // Parent component handles navigation on success
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Review Your Request</h1>
        <p className="text-lg text-slate-600">
          Please verify all information before submitting your onboarding request
        </p>
      </div>

      {/* Preview Sections */}
      <div className="space-y-6 mb-6">
        {/* Basic Information Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="7" r="4" stroke="#14b8a6" strokeWidth="2" />
                </svg>
              </div>
              Basic Information
            </h2>
            <button
              onClick={() => onEditStep(2)}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">NGO Name</p>
              <p className="text-slate-900">{basicInfo.ngoName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Registration Number</p>
              <p className="text-slate-900">{basicInfo.registrationNumber}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-slate-500 mb-1">Address</p>
              <p className="text-slate-900">{basicInfo.address}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-slate-500 mb-1">Description</p>
              <p className="text-slate-900 leading-relaxed">{basicInfo.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Official Email</p>
              <p className="text-slate-900">{basicInfo.officialEmail}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Primary Phone</p>
              <p className="text-slate-900">{basicInfo.primaryPhone}</p>
            </div>

            {basicInfo.secondaryPhone && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Secondary Phone</p>
                <p className="text-slate-900">{basicInfo.secondaryPhone}</p>
              </div>
            )}

            {basicInfo.website && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Website</p>
                <a
                  href={basicInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 hover:underline"
                >
                  {basicInfo.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              Documents
            </h2>
            <button
              onClick={() => onEditStep(3)}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </button>
          </div>

          <div className="space-y-3">
            {/* Registration Certificate */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">Registration Certificate</p>
                <p className="text-xs text-slate-500 truncate">
                  {registrationCertificate?.name}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Required
                </span>
              </div>
            </div>

            {/* Additional Documents */}
            {additionalDocs.length > 0 && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Additional Documents ({additionalDocs.length})
                </p>
                <div className="space-y-2">
                  {additionalDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <div className="shrink-0">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                            stroke="#64748b"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 2V8H20"
                            stroke="#64748b"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 truncate">{doc.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {additionalDocs.length === 0 && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-sm text-slate-500 italic">No additional documents uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" />
                <path d="M12 8V12" stroke="#f59e0b" strokeWidth="2" />
                <path d="M12 16H12.01" stroke="#f59e0b" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-amber-900 mb-2">
                Before You Submit
              </h3>
              <ul className="space-y-1 text-sm text-amber-900">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>
                    Our verification team will review your request within 3-5 business days
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>
                    You'll receive an email notification once your NGO is approved
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>
                    Providing false information may result in permanent rejection
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => onEditStep(3)}
          disabled={isSubmitting}
          className="px-6 py-2.5 text-slate-600 hover:text-slate-900 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeOpacity="0.25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  opacity="0.75"
                />
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </button>
      </div>
    </div>
  );
};

export default StepFourPreview;
