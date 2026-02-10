// NGO registration card component with full API integration

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerNgo } from "../../features/auth/api.js";

const RegisterNgoCard = () => {
  // Form state - admin info
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    ngoName: "",
    registrationNumber: "",
    contactNumber: "",
    website: "",
    address: "",
  });
  
  // UI state
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Validate form on client side
  const validateForm = () => {
    // Check required admin fields
    if (!formData.fullName.trim() || !formData.email.trim() || 
        !formData.password || !formData.confirmPassword) {
      setError("All admin fields are required");
      return false;
    }

    // Check required NGO fields
    if (!formData.ngoName.trim() || !formData.contactNumber.trim() || 
        !formData.address.trim()) {
      setError("NGO name, contact number, and address are required");
      return false;
    }

    // Validate full name length
    if (formData.fullName.trim().length < 2) {
      setError("Admin name must be at least 2 characters");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Validate NGO name
    if (formData.ngoName.trim().length < 2) {
      setError("NGO name must be at least 2 characters");
      return false;
    }

    // Validate contact number
    if (formData.contactNumber.trim().length < 10) {
      setError("Please provide a valid contact number");
      return false;
    }

    // Validate address
    if (formData.address.trim().length < 10) {
      setError("Address must be at least 10 characters");
      return false;
    }

    // Validate website if provided
    if (formData.website.trim()) {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(formData.website.trim())) {
        setError("Please provide a valid website URL");
        return false;
      }
    }

    // Check confirmation agreement
    if (!agreed) {
      setError("You must confirm that the NGO details are accurate");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Prepare data for API
      const ngoData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        ngoName: formData.ngoName.trim(),
        registrationNumber: formData.registrationNumber.trim() || undefined,
        contactNumber: formData.contactNumber.trim(),
        website: formData.website.trim() || undefined,
        address: formData.address.trim(),
      };

      // Call registration API
      const response = await registerNgo(ngoData);

      // Registration successful
      if (response.success) {
        setSuccess(true);
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "NGO registration successful! Please sign in.",
              email: formData.email.trim().toLowerCase()
            } 
          });
        }, 2000);
      }
    } catch (err) {
      // Handle API errors
      console.error("NGO registration error:", err);
      
      // Display user-friendly error message
      if (err.message) {
        setError(err.message);
      } else if (err.status === 409) {
        setError("An account with this email already exists");
      } else if (err.status === 400) {
        setError("Please check your input and try again");
      } else {
        setError("Registration failed. Please try again later");
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Card Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 m-0 mb-3">
          NGO Registration
        </h1>
        <p className="text-slate-600 text-base">
          Join our platform to launch campaigns and receive transparent donations
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-900 mb-1">NGO account created successfully!</p>
              <p className="text-sm text-green-700">Redirecting to login page...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        {/* Admin Information Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-200">
            Admin Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Admin Full Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
                Admin Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
                placeholder="John Doe"
                disabled={isLoading || success}
                required
              />
            </div>

            {/* Admin Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Admin Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
                placeholder="john.doe@ngo.org"
                disabled={isLoading || success}
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
                placeholder="Min. 8 characters"
                disabled={isLoading || success}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
                placeholder="Repeat password"
                disabled={isLoading || success}
                required
              />
            </div>
          </div>
        </div>

        {/* NGO Information Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-200">
            NGO Information
          </h2>
          
          <div className="flex flex-col gap-5">
            {/* NGO Name & Registration Number Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="ngoName" className="text-sm font-semibold text-slate-700">
                  NGO Name
                </label>
                <input
                  type="text"
                  id="ngoName"
                  name="ngoName"
                  value={formData.ngoName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  placeholder="Hope Foundation"
                  disabled={isLoading || success}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="registrationNumber" className="text-sm font-semibold text-slate-700">
                  Registration Number <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  placeholder="12345678"
                  disabled={isLoading || success}
                />
              </div>
            </div>

            {/* Contact & Website Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="contactNumber" className="text-sm font-semibold text-slate-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  placeholder="+1 (555) 000-0000"
                  disabled={isLoading || success}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="website" className="text-sm font-semibold text-slate-700">
                  Website <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  placeholder="www.hopefoundation.org"
                  disabled={isLoading || success}
                />
              </div>
            </div>

            {/* Address Textarea */}
            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="text-sm font-semibold text-slate-700">
                Registered Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                placeholder="Enter NGO registered address"
                disabled={isLoading || success}
                required
              />
            </div>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-start gap-3 pt-2 pb-2">
          <input
            type="checkbox"
            id="ngoConfirm"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-2 focus:ring-slate-900/20 disabled:cursor-not-allowed"
            disabled={isLoading || success}
          />
          <label htmlFor="ngoConfirm" className="text-sm text-slate-600 leading-relaxed">
            I confirm that the NGO details provided are accurate and verifiable
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full px-6 py-4 bg-slate-900 text-white border-none rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 hover:bg-slate-800 hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={!agreed || isLoading || success}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering NGO...
            </>
          ) : success ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Registration complete!
            </>
          ) : (
            "Register NGO"
          )}
        </button>
      </form>

      {/* Footer Links */}
      {!success && (
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 m-0">
            Already registered?{" "}
            <Link to="/login" className="text-slate-900 no-underline font-semibold hover:underline">
              Sign in
            </Link>
          </p>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <Link 
              to="/register/user" 
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 no-underline font-medium hover:text-slate-900 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Register as a Donor
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterNgoCard;
