// src/features/profile/pages/ProfilePage.jsx
// User profile page for donors

import { useAuth } from "../../../state/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            My Profile
          </h1>
          <p className="text-slate-600">
            Manage your account information
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-500 mb-1">Full Name</label>
              <p className="text-base text-slate-900">{user?.name || 'N/A'}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-500 mb-1">Email Address</label>
              <p className="text-base text-slate-900">{user?.email || 'N/A'}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-500 mb-1">Account Type</label>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full w-fit">
                Donor
              </span>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Donation History
          </h2>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-slate-600 text-base mb-2">No donations yet</p>
            <p className="text-slate-500 text-sm mb-4">
              Your donation history will appear here
            </p>
            <a
              href="/campaigns"
              className="inline-block px-6 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors no-underline"
            >
              Browse Campaigns
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
