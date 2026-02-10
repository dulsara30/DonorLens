// src/pages/RegisterNgoPage.jsx
// NGO registration page with split-screen layout

import { Link } from "react-router-dom";
import AuthHeader from "../components/auth/AuthHeader";
import RegisterNgoCard from "../components/auth/RegisterNgoCard";

const RegisterNgoPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <AuthHeader />
      
      <main className="flex-1 flex">
        {/* Left Side - Trust & Benefits Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-16 items-center justify-center relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-indigo-500/10" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

          {/* Content */}
          <div className="max-w-lg relative z-10">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold mb-8">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Verified NGO Platform
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight text-white">
                Launch campaigns with full transparency
              </h1>
              <p className="text-xl leading-relaxed text-slate-400">
                Join verified NGOs using our platform to receive donations with complete accountability and real-time tracking.
              </p>
            </div>

            {/* Trust & Verification Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8V12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16H12.01" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  Trust & Verification
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  We verify NGO details for transparency and build donor trust
                </p>
              </div>

              <div className="space-y-3 pl-10">
                <div className="flex items-center gap-3 text-slate-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">NGO verification and credibility checks</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">Track expenses with proof uploads</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">Publish final impact reports</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-slate-400">Verified NGOs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">$2M+</div>
                <div className="text-sm text-slate-400">Funds Raised</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-slate-400">Trust Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
          <RegisterNgoCard />
        </div>
      </main>
    </div>
  );
};

export default RegisterNgoPage;
