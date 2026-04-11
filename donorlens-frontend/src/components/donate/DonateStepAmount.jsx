import { formatCurrency } from '../../features/payments/helpers';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function DonateStepAmount({
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
  useCustom,
  setUseCustom,
  finalAmount,
  errors,
  setErrors,
}) {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Choose Your Donation Amount</h2>
      <p className="text-sm text-slate-500 mb-8">Every contribution makes a real impact.</p>

      {/* Preset amount buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
        {PRESET_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type="button"
            id={`amount-${amt}`}
            onClick={() => {
              setSelectedAmount(amt);
              setUseCustom(false);
              setErrors({});
            }}
            className={`py-3 px-2 rounded-2xl border-2 text-sm font-bold transition-all duration-200 cursor-pointer ${!useCustom && selectedAmount === amt
                ? 'border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-200'
                : 'border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50'
              }`}
          >
            <span className="block text-xs font-normal opacity-70">LKR</span>
            {amt.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Or enter a custom amount
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-medium text-sm">
            LKR
          </span>
          <input
            id="custom-amount"
            type="number"
            min="50"
            placeholder="e.g. 3,500"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setUseCustom(true);
              setErrors({});
            }}
            onFocus={() => setUseCustom(true)}
            className={`w-full pl-14 pr-4 py-3.5 rounded-xl border text-sm font-semibold text-slate-800 outline-none transition-all duration-200 ${useCustom
                ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50/30'
                : 'border-slate-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
          />
        </div>
        {errors.amount && (
          <p className="mt-2 text-xs text-rose-500 flex items-center gap-1">
            <span>⚠</span>{errors.amount}
          </p>
        )}
      </div>

      {/* Donation summary strip */}
      {finalAmount > 0 && (
        <div className="mt-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-4 border border-teal-100 flex items-center justify-between">
          <span className="text-sm text-teal-700 font-medium">Your donation</span>
          <span className="text-2xl font-bold text-teal-700">{formatCurrency(finalAmount)}</span>
        </div>
      )}

      {/* PayHere security badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Payments secured by <span className="font-semibold text-slate-500 ml-1">PayHere</span>
      </div>
    </div>
  );
}
