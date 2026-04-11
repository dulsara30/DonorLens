import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';

const PENDING_KEY = 'dl_pending_donation';

// Animated warning / not-completed icon
function NotCompletedIcon() {
  return (
    <svg
      className="w-16 h-16"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="38" stroke="#fb923c" strokeWidth="3" />
      {/* Exclamation mark */}
      <rect x="37" y="22" width="6" height="24" rx="3" fill="#fb923c" />
      <rect x="37" y="52" width="6" height="6" rx="3" fill="#fb923c" />
    </svg>
  );
}

// Reason card
function ReasonCard({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
      <div className="text-slate-400 mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || null;
  const [show, setShow] = useState(false);
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Read and clear the pending donation so it doesn't carry over
  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (raw) {
      try { setDonation(JSON.parse(raw)); } catch { }
      // Clear it — payment was not completed
      sessionStorage.removeItem(PENDING_KEY);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-slate-50 flex flex-col">
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .pop-in { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-20 md:py-28">
        <div
          className={`max-w-lg w-full transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100/60 border border-slate-100 overflow-hidden">

            {/* Top accent band */}
            <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-amber-400" />

            <div className="px-8 pt-10 pb-8">

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="pop-in">
                  <NotCompletedIcon />
                </div>
              </div>

              {/* Headline */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Payment Not Completed
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Your payment was not processed successfully. This could be
                  because you cancelled, your account had insufficient balance,
                  or your card was declined.
                </p>

                {/* Order ID badge (if available) */}
                {orderId && (
                  <div className="inline-flex items-center gap-2 mt-4 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono font-semibold px-4 py-2 rounded-full">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Order: {orderId}
                  </div>
                )}
              </div>

              {/* Common reasons */}
              <div className="space-y-3 mb-8">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Possible reasons
                </h2>

                <ReasonCard
                  title="Insufficient account balance"
                  description="Your bank account or card may not have enough funds to complete this transaction."
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  }
                />

                <ReasonCard
                  title="Payment cancelled by you"
                  description="You pressed the Cancel button on the PayHere checkout page before completing payment."
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                />

                <ReasonCard
                  title="Card declined by bank"
                  description="Your bank may have blocked the transaction for security reasons. Contact your bank to allow online payments."
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  }
                />

                <ReasonCard
                  title="Network or session timeout"
                  description="A poor internet connection or an expired session can interrupt the payment. Please try again."
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  }
                />
              </div>

              {/* Reassurance — you have NOT been charged */}
              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-teal-500 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-teal-800 leading-relaxed">
                  <span className="font-semibold">You have not been charged.</span>{' '}
                  If your bank placed a temporary hold on any amount, it will
                  be automatically released within 3–5 business days.
                </p>
              </div>

              {/* CTA actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={donation?.campaignId ? `/campaigns/${donation.campaignId}/donate` : '/campaigns'}
                  id="try-again-btn"
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm font-bold rounded-2xl text-center hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200 hover:shadow-xl transition-all duration-200 no-underline"
                >
                  Try Again
                </Link>
                <Link
                  to="/"
                  id="go-home-from-cancel-btn"
                  className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-2xl text-center hover:bg-slate-50 transition-all duration-200 no-underline"
                >
                  Back to Home
                </Link>
              </div>

              {/* Support link */}
              <p className="text-center text-xs text-slate-400 mt-6">
                Still having trouble?{' '}
                <a
                  href="mailto:support@donorlens.org"
                  className="text-teal-600 hover:underline"
                >
                  Contact Support
                </a>
              </p>
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
