export default function DonateFormInput({ label, id, icon, error, required, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400
            bg-white transition-all duration-200 outline-none
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
              : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
            }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
          <span>⚠</span>{error}
        </p>
      )}
    </div>
  );
}
