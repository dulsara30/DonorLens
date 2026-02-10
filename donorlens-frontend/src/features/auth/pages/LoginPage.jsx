// src/features/auth/pages/LoginPage.jsx
// Professional login page with split-screen layout

import { Link } from "react-router-dom";
import AuthHeader from "../../../components/auth/AuthHeader";
import LoginCard from "../../../components/auth/LoginCard";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <AuthHeader />
      
      <main className="flex-1 flex">
        {/* Left Side - Visual Content Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-16 items-center justify-center relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-transparent to-cyan-500/10" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

          {/* Content */}
          <div className="max-w-lg relative z-10">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-semibold mb-8">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                Trusted by 10,000+ donors worldwide
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight text-white">
                Track every rupee,<br />see real impact
              </h1>
              <p className="text-xl leading-relaxed text-slate-400">
                Join thousands of donors who trust us for transparent, verified giving with complete accountability.
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">100% Transparent Tracking</h3>
                  <p className="text-sm text-slate-400">Track every donation from transfer to impact with real-time updates and proof uploads.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Verified NGOs Only</h3>
                  <p className="text-sm text-slate-400">All NGOs are verified for legitimacy with complete documentation and track records.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real-Time Updates</h3>
                  <p className="text-sm text-slate-400">Get instant notifications on campaign progress and see impact as it happens.</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-white mb-1">₹2Cr+</div>
                <div className="text-sm text-slate-400">Donated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">850+</div>
                <div className="text-sm text-slate-400">Campaigns</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-slate-400">Transparent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
          <LoginCard />
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
