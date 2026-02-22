// Step 2: Basic NGO Information
// Two-column responsive form for collecting NGO details

const StepTwoBasicInfo = ({ basicInfo, updateBasicInfo, errors, onNext, onPrevious }) => {
  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Basic NGO Information</h1>
        <p className="text-lg text-slate-600">
          Tell us about your organization and how we can reach you
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* NGO Identity Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Organization Identity
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Official details as registered with authorities
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NGO Name */}
              <div>
                <label
                  htmlFor="ngoName"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  NGO Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ngoName"
                  value={basicInfo.ngoName}
                  onChange={(e) => updateBasicInfo('ngoName', e.target.value)}
                  placeholder="e.g., Hope Foundation for Education"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.ngoName
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500'
                  }`}
                />
                {errors.ngoName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    {errors.ngoName}
                  </p>
                )}
              </div>

              {/* Registration Number */}
              <div>
                <label
                  htmlFor="registrationNumber"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  value={basicInfo.registrationNumber}
                  onChange={(e) => updateBasicInfo('registrationNumber', e.target.value)}
                  placeholder="e.g., NGO-2024-12345"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.registrationNumber
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500'
                  }`}
                />
                {errors.registrationNumber && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    {errors.registrationNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Address - Full Width */}
            <div className="mt-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Registered Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                value={basicInfo.address}
                onChange={(e) => updateBasicInfo('address', e.target.value)}
                placeholder="Enter complete registered address including city, state, and postal code"
                rows="3"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.address
                    ? 'border-red-300 focus:ring-red-200 bg-red-50'
                    : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                  </svg>
                  {errors.address}
                </p>
              )}
            </div>

            {/* Description - Full Width */}
            <div className="mt-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                NGO Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={basicInfo.description}
                onChange={(e) => updateBasicInfo('description', e.target.value)}
                placeholder="Briefly describe your NGO's mission, vision, and main activities (minimum 50 characters)"
                rows="4"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description
                    ? 'border-red-300 focus:ring-red-200 bg-red-50'
                    : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500'
                }`}
              />
              <div className="mt-1 flex justify-between items-center">
                <div>
                  {errors.description && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 8V12" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                      </svg>
                      {errors.description}
                    </p>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    basicInfo.description.length < 50 ? 'text-slate-400' : 'text-teal-600'
                  }`}
                >
                  {basicInfo.description.length} / 50 minimum
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Contact Information
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              How can we and donors reach your organization?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Official Email */}
              <div>
                <label
                  htmlFor="officialEmail"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Official Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="officialEmail"
                  value={basicInfo.officialEmail}
                  onChange={(e) => updateBasicInfo('officialEmail', e.target.value)}
                  placeholder="info@yourorganization.org"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.officialEmail
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500'
                  }`}
                />
                {errors.officialEmail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    {errors.officialEmail}
                  </p>
                )}
              </div>

              {/* Primary Phone */}
              <div>
                <label
                  htmlFor="primaryPhone"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Primary Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="primaryPhone"
                  value={basicInfo.primaryPhone}
                  onChange={(e) => updateBasicInfo('primaryPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.primaryPhone
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500'
                  }`}
                />
                {errors.primaryPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    {errors.primaryPhone}
                  </p>
                )}
              </div>

              {/* Secondary Phone - Optional */}
              <div>
                <label
                  htmlFor="secondaryPhone"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Secondary Phone{' '}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  id="secondaryPhone"
                  value={basicInfo.secondaryPhone}
                  onChange={(e) => updateBasicInfo('secondaryPhone', e.target.value)}
                  placeholder="+1 (555) 987-6543"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.secondaryPhone
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500'
                  }`}
                />
                {errors.secondaryPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    {errors.secondaryPhone}
                  </p>
                )}
              </div>

              {/* Website - Optional */}
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Website <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  id="website"
                  value={basicInfo.website}
                  onChange={(e) => updateBasicInfo('website', e.target.value)}
                  placeholder="https://yourorganization.org"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.website
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500'
                  }`}
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    {errors.website}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
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
          Continue to Documents
        </button>
      </div>
    </div>
  );
};

export default StepTwoBasicInfo;
