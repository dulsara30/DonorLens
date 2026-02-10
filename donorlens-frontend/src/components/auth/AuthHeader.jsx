// src/components/auth/AuthHeader.jsx
// Minimal authentication header with logo and navigation

import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const AuthHeader = () => {
  return (
    <header className="px-8 py-5 bg-white border-b border-slate-200 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <img src={logo} alt="DonorLens Logo" className="h-15 w-auto" />
        </Link>
        
        <Link to="/" className="text-slate-600 no-underline font-medium text-sm transition-colors duration-200 hover:text-slate-900 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
      </div>
    </header>
  );
};

export default AuthHeader;
