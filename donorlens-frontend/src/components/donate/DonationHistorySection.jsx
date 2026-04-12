// src/components/donate/DonationHistorySection.jsx
// Shows the current user's past donations, fetched from /payment/my

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPaymentsApi } from '../../features/payments/api';

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    success:    { label: 'Success',    cls: 'bg-teal-100 text-teal-700 border-teal-200' },
    completed:  { label: 'Success',    cls: 'bg-teal-100 text-teal-700 border-teal-200' },
    pending:    { label: 'Pending',    cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    failed:     { label: 'Failed',     cls: 'bg-rose-100  text-rose-700  border-rose-200'  },
    cancelled:  { label: 'Cancelled',  cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    canceled:   { label: 'Cancelled',  cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  };
  const key     = (status || '').toLowerCase();
  const { label, cls } = map[key] || { label: status || 'Unknown', cls: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

// ── Payment method icon ───────────────────────────────────────────────────────
function MethodIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

// ── Single donation row ───────────────────────────────────────────────────────
function DonationRow({ donation, index }) {
  const date = donation.createdAt
    ? new Date(donation.createdAt).toLocaleDateString('en-LK', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

  const amount = donation.amount
    ? new Intl.NumberFormat('en-LK', { style: 'currency', currency: donation.currency || 'LKR', minimumFractionDigits: 2 }).format(donation.amount)
    : '—';

  return (
    <div
      className="group flex items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition-all duration-150 animate-slide-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Left: icon + campaign info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {donation.campaignTitle || donation.items || 'Campaign Donation'}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">{date}</span>
            {donation.orderId && (
              <>
                <span className="text-slate-200">•</span>
                <span className="text-xs font-mono text-slate-400 truncate max-w-[120px]">
                  {donation.orderId}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: amount + status + method */}
      <div className="flex items-center gap-3 shrink-0">
        {donation.method && (
          <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
            <MethodIcon />
            {donation.method}
          </span>
        )}
        <StatusBadge status={donation.status} />
        <span className="text-sm font-bold text-slate-800 tabular-nums min-w-[80px] text-right">
          {amount}
        </span>
        {donation.campaignId && (
          <Link
            to={`/campaigns/${donation.campaignId}`}
            className="text-slate-300 hover:text-teal-500 transition-colors no-underline"
            title="View campaign"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeletons() {
  return (
    <div className="space-y-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 py-4 border-b border-slate-100 last:border-0 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-slate-100 rounded-full w-2/3" />
            <div className="h-2.5 bg-slate-100 rounded-full w-1/3" />
          </div>
          <div className="h-3.5 bg-slate-100 rounded-full w-16" />
        </div>
      ))}
    </div>
  );
}

// ── Summary stats row ─────────────────────────────────────────────────────────
function SummaryStats({ donations }) {
  const successful = donations.filter(d =>
    ['success', 'completed'].includes((d.status || '').toLowerCase())
  );
  const totalAmount = successful.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
  const formatted   = new Intl.NumberFormat('en-LK', {
    style: 'currency', currency: 'LKR', minimumFractionDigits: 2,
  }).format(totalAmount);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: 'Total Donated',    value: formatted,              icon: '💚' },
        { label: 'Successful',       value: successful.length,      icon: '✅' },
        { label: 'Total Donations',  value: donations.length,       icon: '📋' },
      ].map(({ label, value, icon }) => (
        <div key={label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
          <p className="text-lg mb-0.5">{icon}</p>
          <p className="text-lg font-bold text-slate-900 leading-tight truncate">{value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function DonationHistorySection() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    getMyPaymentsApi()
      .then((res) => {
        // API may return { data: [...] } or an array directly
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setDonations(list);
      })
      .catch((err) => {
        console.error('Failed to fetch donation history:', err);
        setError('Could not load your donation history. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Donation History</h2>
            {!loading && !error && donations.length > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">{donations.length} donation{donations.length !== 1 ? 's' : ''} found</p>
            )}
          </div>
        </div>

        {!loading && !error && donations.length > 0 && (
          <Link
            to="/campaigns"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 no-underline hidden sm:block"
          >
            Donate again →
          </Link>
        )}
      </div>

      {/* Loading */}
      {loading && <Skeletons />}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && donations.length === 0 && (
        <div className="text-center py-14">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">No donations yet</h3>
          <p className="text-sm text-slate-500 mb-5">Your donation history will appear here once you make a contribution.</p>
          <Link
            to="/campaigns"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-200 transition-all duration-200 no-underline"
          >
            Browse Campaigns
          </Link>
        </div>
      )}

      {/* Donations list */}
      {!loading && !error && donations.length > 0 && (
        <>
          <SummaryStats donations={donations} />
          <div>
            {donations.map((donation, i) => (
              <DonationRow key={donation._id || donation.orderId || i} donation={donation} index={i} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
