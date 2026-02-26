// Professional 3-step password setup page for NGO account activation

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../../state/useAuth";
import AuthHeader from "../../../components/auth/AuthHeader";
import {
  verifyPasswordSetupTokenAPI,
  verifyIdentityAPI,
  setPasswordAPI,
} from "../passwordSetup.api";

/**
 * PasswordSetupPage Component
 *
 * 3-Step Password Setup Flow:
 * 1. Token Verification (auto on load)
 * 2. Identity Verification (email + registration number)
 * 3. Password Creation (password + confirm)
 *
 * Features:
 * - Token validation on every page load/refresh
 * - Protected from logged-in users
 * - Isolated route (token-only access)
 * - Industry-level UI with progress indicator
 * - Comprehensive error handling
 */
const PasswordSetupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Get token from URL
  const token = searchParams.get("token");

  // Step management
  const [currentStep, setCurrentStep] = useState(0); // 0: verifying, 1: identity, 2: password, 3: success
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form data
  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Step 1: Verify token on mount and every refresh
   */
  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate("/admin/dashboard");
      return;
    }

    // Check if token exists
    if (!token) {
      setError("Invalid or missing token. Please check your email link.");
      setLoading(false);
      return;
    }

    // Verify token
    const verifyToken = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await verifyPasswordSetupTokenAPI(token);

        if (response.success) {
          // Token is valid, proceed to identity verification
          setCurrentStep(1);
        } else {
          setError(response.message || "Invalid or expired token.");
        }
      } catch (err) {
        console.error("Token verification error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to verify token. The link may have expired or already been used.",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, isAuthenticated, navigate]);

  /**
   * Step 2: Handle identity verification
   */
  const handleIdentityVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    // Client-side validation
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!registrationNumber.trim()) {
      errors.registrationNumber = "Registration number is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await verifyIdentityAPI({
        token,
        email: email.trim(),
        registrationNumber: registrationNumber.trim(),
      });

      if (response.success) {
        // Identity verified, proceed to password setup
        setCurrentStep(2);
      } else {
        setError(response.message || "Identity verification failed.");
      }
    } catch (err) {
      console.error("Identity verification error:", err);
      setError(
        err.response?.data?.message ||
          "Identity verification failed. Please check your email and registration number.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 3: Handle password setup
   */
  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    // Client-side validation
    const errors = {};
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await setPasswordAPI({
        token,
        email: email.trim(),
        registrationNumber: registrationNumber.trim(),
        password,
        confirmPassword,
      });

      if (response.success) {
        // Password set successfully
        setCurrentStep(3);
      } else {
        setError(response.message || "Failed to set password.");
      }
    } catch (err) {
      console.error("Password setup error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to set password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Password strength indicator
   */
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 3)
      return { strength, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 4) return { strength, label: "Good", color: "bg-blue-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AuthHeader />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Progress Indicator */}
          {currentStep > 0 && currentStep < 3 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[
                  { num: 1, label: "Verify Token" },
                  { num: 2, label: "Verify Identity" },
                  { num: 3, label: "Set Password" },
                ].map((step, idx) => (
                  <div key={step.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center w-full">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                          currentStep > idx
                            ? "bg-teal-500 text-white"
                            : currentStep === idx + 1
                              ? "bg-teal-500 text-white ring-4 ring-teal-100"
                              : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {currentStep > idx + 1 ? "✓" : step.num}
                      </div>
                      <span className="text-xs mt-2 text-slate-600 font-medium">
                        {step.label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`h-1 flex-1 mx-2 rounded transition-all ${
                          currentStep > idx + 1 ? "bg-teal-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Step 0: Token Verification (Loading) */}
            {currentStep === 0 && (
              <div className="p-12 text-center">
                {loading && !error && (
                  <>
                    <div className="w-16 h-16 mx-auto mb-6">
                      <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                      Verifying Your Link...
                    </h2>
                    <p className="text-slate-600">
                      Please wait while we verify your password setup link
                    </p>
                  </>
                )}

                {error && (
                  <>
                    <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                      Verification Failed
                    </h2>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-red-700">{error}</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600">
                        Common reasons for this error:
                      </p>
                      <ul className="text-sm text-slate-600 text-left max-w-md mx-auto space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>The link has expired (valid for 24 hours)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>The link has already been used</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>The link was copied incorrectly</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-8 flex gap-4 justify-center">
                      <Link
                        to="/"
                        className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                      >
                        Go Home
                      </Link>
                      <a
                        href="mailto:support@donorlens.com"
                        className="px-6 py-2.5 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
                      >
                        Contact Support
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 1: Identity Verification */}
            {currentStep === 1 && (
              <div className="p-8">
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Verify Your Identity
                  </h2>
                  <p className="text-slate-600">
                    Please enter your email and registration number to continue
                  </p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
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
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleIdentityVerification}
                  className="space-y-5"
                >
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationErrors.email) {
                          setValidationErrors({
                            ...validationErrors,
                            email: null,
                          });
                        }
                      }}
                      placeholder="ngo@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        validationErrors.email
                          ? "border-red-300 bg-red-50"
                          : "border-slate-300"
                      }`}
                      disabled={loading}
                    />
                    {validationErrors.email && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Registration Number Field */}
                  <div>
                    <label
                      htmlFor="registrationNumber"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      NGO Registration Number
                    </label>
                    <input
                      type="text"
                      id="registrationNumber"
                      value={registrationNumber}
                      onChange={(e) => {
                        setRegistrationNumber(e.target.value);
                        if (validationErrors.registrationNumber) {
                          setValidationErrors({
                            ...validationErrors,
                            registrationNumber: null,
                          });
                        }
                      }}
                      placeholder="Enter your registration number"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        validationErrors.registrationNumber
                          ? "border-red-300 bg-red-50"
                          : "border-slate-300"
                      }`}
                      disabled={loading}
                    />
                    {validationErrors.registrationNumber && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {validationErrors.registrationNumber}
                      </p>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Security Check</p>
                        <p>
                          This information must match the details you provided
                          during registration to ensure account security.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:ring-4 focus:ring-teal-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Password Creation */}
            {currentStep === 2 && (
              <div className="p-8">
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Create Your Password
                  </h2>
                  <p className="text-slate-600">
                    Choose a strong password to secure your account
                  </p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
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
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handlePasswordSetup} className="space-y-5">
                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors({
                            ...validationErrors,
                            password: null,
                          });
                        }
                      }}
                      placeholder="Enter a strong password"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        validationErrors.password
                          ? "border-red-300 bg-red-50"
                          : "border-slate-300"
                      }`}
                      disabled={loading}
                    />
                    {validationErrors.password && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {validationErrors.password}
                      </p>
                    )}

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-600">
                            Password Strength:
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              passwordStrength.strength <= 2
                                ? "text-red-600"
                                : passwordStrength.strength <= 3
                                  ? "text-yellow-600"
                                  : passwordStrength.strength <= 4
                                    ? "text-blue-600"
                                    : "text-green-600"
                            }`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{
                              width: `${(passwordStrength.strength / 5) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (validationErrors.confirmPassword) {
                          setValidationErrors({
                            ...validationErrors,
                            confirmPassword: null,
                          });
                        }
                      }}
                      placeholder="Re-enter your password"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        validationErrors.confirmPassword
                          ? "border-red-300 bg-red-50"
                          : "border-slate-300"
                      }`}
                      disabled={loading}
                    />
                    {validationErrors.confirmPassword && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {validationErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Password Requirements:
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <span
                          className={
                            password.length >= 8
                              ? "text-green-500"
                              : "text-slate-400"
                          }
                        >
                          {password.length >= 8 ? "✓" : "○"}
                        </span>
                        <span>At least 8 characters long</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={
                            /[A-Z]/.test(password) && /[a-z]/.test(password)
                              ? "text-green-500"
                              : "text-slate-400"
                          }
                        >
                          {/[A-Z]/.test(password) && /[a-z]/.test(password)
                            ? "✓"
                            : "○"}
                        </span>
                        <span>Contains uppercase and lowercase letters</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={
                            /[0-9]/.test(password)
                              ? "text-green-500"
                              : "text-slate-400"
                          }
                        >
                          {/[0-9]/.test(password) ? "✓" : "○"}
                        </span>
                        <span>Contains at least one number</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={
                            /[^a-zA-Z0-9]/.test(password)
                              ? "text-green-500"
                              : "text-slate-400"
                          }
                        >
                          {/[^a-zA-Z0-9]/.test(password) ? "✓" : "○"}
                        </span>
                        <span>Contains a special character (recommended)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:ring-4 focus:ring-teal-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Setting Up...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Activate My Account</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Success */}
            {currentStep === 3 && (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  🎉 Account Activated!
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Your password has been set successfully. You can now log in
                  and start creating campaigns!
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <svg
                      className="w-6 h-6 text-green-500 shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="font-semibold text-green-900 mb-2">
                        What's Next?
                      </p>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li className="flex items-start gap-2">
                          <span>1.</span>
                          <span>Log in using your email and password</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>2.</span>
                          <span>Complete your NGO profile</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>3.</span>
                          <span>Create your first fundraising campaign</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>4.</span>
                          <span>Start making an impact!</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-600 hover:shadow-xl transition-all"
                >
                  <span>Go to Login</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>

                <p className="mt-6 text-sm text-slate-500">
                  Check your email for a confirmation message with your login
                  credentials.
                </p>
              </div>
            )}
          </div>

          {/* Footer Help */}
          {currentStep > 0 && currentStep < 3 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Having trouble?{" "}
                <a
                  href="mailto:support@donorlens.com"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PasswordSetupPage;
