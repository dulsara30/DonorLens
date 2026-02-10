// src/components/layout/Header.jsx
// Sticky navigation header with logo, nav links, and CTA buttons

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/useAuth";
import logo from "../../assets/logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
      isScrolled ? 'py-3' : 'py-5'
    }`}>
      <div className={`max-w-7xl mx-auto px-6 transition-all duration-300 ease-out ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-2xl' 
          : 'bg-white/95 backdrop-blur-sm shadow-sm rounded-2xl'
      }`}>
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <img 
              src={logo} 
              alt="DonorLens Logo" 
              className={`w-auto transition-all duration-300 ease-out ${
                isScrolled ? 'h-11' : 'h-13'
              }`} 
            />
          </Link>

          {/* Navigation */}
          <nav className="flex gap-8 items-center">
            <Link 
              to="/" 
              className="no-underline font-medium text-sm text-slate-700 hover:text-teal-600 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
            <Link 
              to="/campaigns" 
              className="no-underline font-medium text-sm text-slate-700 hover:text-teal-600 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Campaigns
            </Link>
            <Link 
              to="/transparency" 
              className="no-underline font-medium text-sm text-slate-700 hover:text-teal-600 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Transparency
            </Link>
          </nav>

          {/* CTA Buttons / User Profile */}
          <div className="flex gap-3 items-center">
            <Link 
              to="/campaigns" 
              className="px-5 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 hover:shadow-md transition-all duration-200 no-underline"
            >
              Donate Now
            </Link>
            
            {!isAuthenticated ? (
              <Link 
                to="/login" 
                className="px-5 py-2 bg-transparent text-teal-600 text-sm font-semibold border border-teal-600 rounded-lg hover:bg-teal-50 transition-all duration-200 no-underline"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Icon */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-teal-600 text-white font-semibold text-sm flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-teal-700 hover:bg-teal-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                  aria-label="User menu"
                >
                  {getInitials(user?.fullName)}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-fade-in">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {user?.role === 'NGO_ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors no-underline"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Admin Dashboard
                        </Link>
                      )}
                      
                      {user?.role === 'USER' && (
                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors no-underline"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          User Profile
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-none bg-transparent cursor-pointer"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
