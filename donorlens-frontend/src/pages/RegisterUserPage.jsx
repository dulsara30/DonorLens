// User registration page with split-screen layout

import { Link } from "react-router-dom";
import AuthHeader from "../components/auth/AuthHeader";
import RegisterCard from "../components/auth/RegisterCard";

const RegisterUserPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <AuthHeader />
      
      <main className="flex-1 flex">
        {/* Left Side - Benefits Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-16 items-center justify-center relative overflow-hidden">
          {/* Gradient Overlay */}
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
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Trusted by 10,000+ donors
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight text-white">
                Start making <br />meaningful impact
              </h1>
              <p className="text-xl leading-relaxed text-slate-400">
                Join thousands of donors using transparent tracking to ensure every contribution creates real change.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-slate-700/50 group-hover:border-teal-500/30 transition-all duration-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="9" stroke="#334155" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white mb-1">100% Transparency</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Track every dollar from donation to impact</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-slate-700/50 group-hover:border-teal-500/30 transition-all duration-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="9" stroke="#334155" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white mb-1">Verified Updates</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Real-time proofs from trusted NGO partners</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-slate-700/50 group-hover:border-teal-500/30 transition-all duration-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="9" stroke="#334155" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white mb-1">Measurable Impact</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">See the real-world change you're creating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
          <RegisterCard />
        </div>
      </main>
    </div>
  );
};

export default RegisterUserPage;
