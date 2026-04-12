// src/features/profile/pages/ProfilePage.jsx
// User profile page for donors – personal info + donation history

import { Link } from 'react-router-dom';
import { useAuth } from '../../../state/useAuth';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import DonationHistorySection from '../../../components/donate/DonationHistorySection';

// Labelled info row
function InfoRow({ label, value, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      {children ?? <span className="text-base text-slate-800 font-medium">{value || '—'}</span>}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.name?.[0] || 'U').toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20 flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Hero card ─────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Accent banner */}
            <div className="h-24 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600" />

            <div className="px-6 pb-6 -mt-10">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-teal-200 mb-4 ring-4 ring-white">
                {initials}
              </div>

              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {user?.fullName || user?.name || 'My Profile'}
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">{user?.email || ''}</p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-100 mt-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Donor
                </span>
              </div>
            </div>
          </div>

          {/* ── Personal information ────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoRow label="Full Name"    value={user?.fullName || user?.name} />
              <InfoRow label="Email Address" value={user?.email} />
              <InfoRow label="Account Role">
                <span className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full border border-teal-100 w-fit">
                  Donor
                </span>
              </InfoRow>
              <InfoRow label="Member Since"
                value={user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })
                  : undefined}
              />
            </div>
          </div>

          {/* ── Donation History ────────────────────────────────────────────── */}
          <DonationHistorySection />

          {/* ── Quick links ─────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm pb-4">
            <Link to="/campaigns" className="text-teal-600 hover:text-teal-700 font-semibold no-underline">
              ← Browse Campaigns
            </Link>
            <Link to="/terms-privacy" className="text-slate-400 hover:text-slate-600 no-underline">
              Terms & Privacy
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
