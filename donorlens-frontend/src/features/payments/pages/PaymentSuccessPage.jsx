
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { createPaymentApi } from '../api';

const PENDING_KEY = 'dl_pending_donation';

// ── Animated check SVG ───────────────────────────────────────────────────────
function AnimatedCheck() {
  return (
    <svg className="w-16 h-16" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" stroke="#14b8a6" strokeWidth="3" />
      <path
        d="M24 41L35 52L56 30"
        stroke="#14b8a6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="50"
        strokeDashoffset="0"
        style={{ animation: 'draw 0.6s ease forwards 0.3s' }}
      />
    </svg>
  );
}

function NextStep({ number, title, description, delay }) {
  return (
    <div className="flex items-start gap-4 animate-slide-in-up" style={{ animationDelay: delay }}>
      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'saving') return <span className="text-xs text-slate-500 animate-pulse">Saving your donation…</span>;
  if (status === 'success') return <span className="text-xs text-teal-700 font-semibold">✓ Donation recorded successfully</span>;
  if (status === 'auth_required') return (
    <span className="text-xs text-amber-700 font-semibold">
      ⚠ Sign in to save your donation history
    </span>
  );
  if (status === 'error') return <span className="text-xs text-rose-600 font-semibold">⚠ Could not record donation — our team has been notified.</span>;
  return null;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || null;

  const [show, setShow] = useState(false);
  const [apiStatus, setApiStatus] = useState('idle'); // idle | saving | success | auth_required | error
  const [donation, setDonation] = useState(null); // saved donation context

  // ── Animate in ────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ── Record donation in backend ────────────────────────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return; // no pending donation (e.g. direct URL access)

    let context;
    try { context = JSON.parse(raw); } catch { return; }

    setDonation(context);

    const record = async () => {
      setApiStatus('saving');
      try {
        await createPaymentApi({
          campaignId: context.campaignId,
          amount: context.amount,
          currency: context.currency || 'LKR',
          paymentMethod: context.paymentMethod || 'ONLINE',
        });
        setApiStatus('success');
      } catch (err) {
        // 401 → user is not authenticated (guest donor via PayHere)
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setApiStatus('auth_required');
        } else {
          console.error('Failed to record payment:', err);
          setApiStatus('error');
        }
      } finally {
        // Always clear the pending donation so it isn't re-submitted on refresh
        sessionStorage.removeItem(PENDING_KEY);
      }
    };

    record();
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/40 via-white to-slate-50 flex flex-col">
      <style>{`
        @keyframes draw  { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }
        @keyframes popIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .pop-in { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-20 md:py-28">
        <div className={`max-w-lg w-full transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* ── Main card ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-teal-100/60 border border-slate-100 overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-cyan-400" />

            <div className="px-8 pt-10 pb-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="pop-in"><AnimatedCheck /></div>
              </div>

              {/* Headline */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Received!</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Thank you for your generous donation. Your payment has been
                  submitted to PayHere and is being processed.
                </p>

                {/* Order ID badge */}
                {orderId && (
                  <div className="inline-flex items-center gap-2 mt-4 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-mono font-semibold px-4 py-2 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order: {orderId}
                  </div>
                )}
              </div>

              {/* ── Donation summary card ─────────────────────────────── */}
              {donation && (
                <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 mb-6 space-y-2">
                  {donation.campaignTitle && (
                    <p className="text-xs text-teal-600 font-medium">
                      Campaign: <span className="font-bold text-teal-800">{donation.campaignTitle}</span>
                    </p>
                  )}
                  <p className="text-xs text-teal-600 font-medium">
                    Amount donated:{' '}
                    <span className="font-bold text-teal-800">
                      LKR {new Intl.NumberFormat('en-LK').format(donation.amount)}
                    </span>
                  </p>
                  <p className="text-xs text-teal-600 font-medium">
                    Payment method: <span className="font-bold text-teal-800">{donation.paymentMethod}</span>
                  </p>

                  {/* Live recording status */}
                  <div className="pt-1 border-t border-teal-100">
                    <StatusBadge status={apiStatus} />
                  </div>
                </div>
              )}

              {/* Info note (when no donation context) */}
              {!donation && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <span className="font-semibold">Confirmation in progress.</span> Your donation will be
                    confirmed once PayHere notifies us of the final payment status.
                  </p>
                </div>
              )}

              {/* What happens next */}
              <div className="space-y-4 mb-8">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">What happens next</h2>
                <NextStep number="1" title="PayHere confirms your payment" description="Our server receives an automatic notification from PayHere with the final payment status." delay="0.1s" />
                <NextStep number="2" title="Your donation is recorded" description="A payment record is created and tied to the campaign, updating its fundraising total." delay="0.2s" />
                <NextStep number="3" title="Your donation goes to work" description="100% of your donation is directed to the campaign. Thank you for making a difference!" delay="0.3s" />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={donation?.campaignId ? `/campaigns/${donation.campaignId}` : '/campaigns'}
                  id="explore-campaigns-btn"
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm font-bold rounded-2xl text-center hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200 hover:shadow-xl transition-all duration-200 no-underline"
                >
                  {donation?.campaignId ? 'Back to Campaign' : 'Explore Campaigns'}
                </Link>
                <Link
                  to="/"
                  id="go-home-btn"
                  className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-2xl text-center hover:bg-slate-50 transition-all duration-200 no-underline"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL Secured
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Powered by PayHere
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              100% to Cause
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
