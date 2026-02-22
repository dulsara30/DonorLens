// Step 3: Document Upload
// Collects required registration certificate and up to 3 optional documents

import DocumentUploader from './DocumentUploader';

const StepThreeDocuments = ({
  registrationCertificate,
  additionalDocs,
  uploadRegistrationCertificate,
  removeRegistrationCertificate,
  addAdditionalDocument,
  removeAdditionalDocument,
  errors,
  onNext,
  onPrevious
}) => {
  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Upload Documents</h1>
        <p className="text-lg text-slate-600">
          Provide official documents to verify your NGO registration
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6">
        {/* Registration Certificate Section */}
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0 mt-1">
              <svg
                width="18"
                height="18"
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
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Registration Certificate
              </h2>
              <p className="text-sm text-slate-600">
                Upload your official NGO registration certificate or incorporation document
              </p>
            </div>
          </div>

          <DocumentUploader
            label="Registration Certificate"
            required={true}
            file={registrationCertificate}
            onUpload={uploadRegistrationCertificate}
            onRemove={removeRegistrationCertificate}
            error={errors.registrationCertificate}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize="5MB"
          />

          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900 flex items-start gap-2">
              <svg
                className="shrink-0 mt-0.5"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>
                This document will be verified by our team. Ensure all text is clearly
                readable and the document is not expired.
              </span>
            </p>
          </div>
        </div>

        {/* Additional Documents Section */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 mt-1">
              <svg
                width="18"
                height="18"
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
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Additional Documents{' '}
                <span className="text-sm font-normal text-slate-500">(Optional)</span>
              </h2>
              <p className="text-sm text-slate-600">
                Upload up to 3 additional documents such as tax exemption certificates,
                annual reports, or other credentials
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Show existing documents */}
            {additionalDocs.map((doc, index) => (
              <DocumentUploader
                key={index}
                label={`Additional Document ${index + 1}`}
                required={false}
                file={doc}
                onUpload={() => {}} // Already uploaded
                onRemove={() => removeAdditionalDocument(index)}
                error={null}
              />
            ))}

            {/* Show upload option if less than 3 */}
            {additionalDocs.length < 3 && (
              <DocumentUploader
                label={`Additional Document ${additionalDocs.length + 1}`}
                required={false}
                file={null}
                onUpload={addAdditionalDocument}
                onRemove={() => {}}
                error={errors.additionalDocs}
              />
            )}
          </div>

          {additionalDocs.length >= 3 && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="2" />
                  <path d="M12 16V12" stroke="#64748b" strokeWidth="2" />
                  <path d="M12 8H12.01" stroke="#64748b" strokeWidth="2" />
                </svg>
                Maximum limit reached (3 additional documents)
              </p>
            </div>
          )}
        </div>

        {/* File Requirements Info */}
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            File Requirements
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-slate-600">
              <svg
                className="shrink-0 mt-0.5"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Accepted formats: PDF, JPG, PNG</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600">
              <svg
                className="shrink-0 mt-0.5"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Maximum file size: 5MB per file</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600">
              <svg
                className="shrink-0 mt-0.5"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Ensure all text is clear and readable</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          className="px-6 py-2.5 text-slate-600 hover:text-slate-900 font-medium transition-colors flex items-center gap-2"
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
          onClick={handleContinue}
          className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 shadow-md hover:shadow-lg transition-all duration-200"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default StepThreeDocuments;
