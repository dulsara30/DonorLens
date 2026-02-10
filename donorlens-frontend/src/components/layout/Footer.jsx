// src/components/layout/Footer.jsx
// Site footer with logo, links, and copyright

import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-[length:200%_200%] text-white py-16 px-8 pb-8 overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-teal-primary/50 before:to-transparent">
      <div className="relative z-[1] max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-16 pb-12 border-b border-white/10 animate-[fadeInUp_0.8s_cubic-bezier(0.4,0,0.2,1)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
              <img src={logo} alt="DonorLens Logo" className="h-9 w-auto drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]" />
              <span className="text-2xl font-bold bg-gradient-to-br from-teal-primary via-teal-light to-teal-primary bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-shift">
                DonorLens
              </span>
            </div>
            <p className="text-slate-400 text-base m-0">See where good goes</p>
            <p className="text-slate-500 text-sm m-0">
              Transparent donation tracking for meaningful impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="text-base font-semibold text-white m-0 mb-2 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-teal-primary after:to-teal-light after:rounded-[2px]">
                Platform
              </h4>
              <Link to="/" className="text-slate-400 no-underline text-[0.95rem] transition-all duration-300 relative inline-block pl-0 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0.5 before:bg-teal-primary before:transition-all before:duration-300 before:rounded-[2px] hover:text-teal-primary hover:pl-5 hover:translate-x-1 hover:before:w-3">
                Home
              </Link>
              <Link to="/campaigns" className="text-slate-400 no-underline text-[0.95rem] transition-all duration-300 relative inline-block pl-0 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0.5 before:bg-teal-primary before:transition-all before:duration-300 before:rounded-[2px] hover:text-teal-primary hover:pl-5 hover:translate-x-1 hover:before:w-3">
                Campaigns
              </Link>
              <Link to="/transparency" className="text-slate-400 no-underline text-[0.95rem] transition-all duration-300 relative inline-block pl-0 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0.5 before:bg-teal-primary before:transition-all before:duration-300 before:rounded-[2px] hover:text-teal-primary hover:pl-5 hover:translate-x-1 hover:before:w-3">
                Transparency
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-base font-semibold text-white m-0 mb-2 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-teal-primary after:to-teal-light after:rounded-[2px]">
                Support
              </h4>
              <Link to="/about" className="text-slate-400 no-underline text-[0.95rem] transition-all duration-300 relative inline-block pl-0 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0.5 before:bg-teal-primary before:transition-all before:duration-300 before:rounded-[2px] hover:text-teal-primary hover:pl-5 hover:translate-x-1 hover:before:w-3">
                About Us
              </Link>
              <Link to="/contact" className="text-slate-400 no-underline text-[0.95rem] transition-all duration-300 relative inline-block pl-0 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0.5 before:bg-teal-primary before:transition-all before:duration-300 before:rounded-[2px] hover:text-teal-primary hover:pl-5 hover:translate-x-1 hover:before:w-3">
                Contact
              </Link>
              <Link to="/faq" className="text-slate-400 no-underline text-[0.95rem] transition-all duration-300 relative inline-block pl-0 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0.5 before:bg-teal-primary before:transition-all before:duration-300 before:rounded-[2px] hover:text-teal-primary hover:pl-5 hover:translate-x-1 hover:before:w-3">
                FAQ
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-base font-semibold text-white m-0 mb-2 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-teal-primary after:to-teal-light after:rounded-[2px]">
                Legal
              </h4>
              <Link to="/privacy" className="text-slate-400 no-underline text-[0.95rem] transition-all duration-300 relative inline-block pl-0 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0.5 before:bg-teal-primary before:transition-all before:duration-300 before:rounded-[2px] hover:text-teal-primary hover:pl-5 hover:translate-x-1 hover:before:w-3">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 no-underline text-[0.95rem] transition-all duration-300 relative inline-block pl-0 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0.5 before:bg-teal-primary before:transition-all before:duration-300 before:rounded-[2px] hover:text-teal-primary hover:pl-5 hover:translate-x-1 hover:before:w-3">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 text-sm text-slate-500 animate-[fadeInUp_1s_cubic-bezier(0.4,0,0.2,1)_0.3s] [animation-fill-mode:backwards] max-md:flex-col max-md:gap-2 max-md:text-center">
          <p className="m-0 transition-colors duration-300 hover:text-slate-400">
            &copy; {new Date().getFullYear()} DonorLens. All rights reserved.
          </p>
          <p className="m-0 transition-colors duration-300 hover:text-slate-400">
            Building trust through transparency
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
