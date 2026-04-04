import MapPicker from "./MapPicker";

const sdgGoals = [
  { number: 1, name: "No Poverty" },
  { number: 2, name: "Zero Hunger" },
  { number: 3, name: "Good Health and Well-being" },
  { number: 4, name: "Quality Education" },
  { number: 5, name: "Gender Equality" },
  { number: 6, name: "Clean Water and Sanitation" },
  { number: 7, name: "Affordable and Clean Energy" },
  { number: 8, name: "Decent Work and Economic Growth" },
  { number: 9, name: "Industry, Innovation and Infrastructure" },
  { number: 10, name: "Reduced Inequalities" },
  { number: 11, name: "Sustainable Cities and Communities" },
  { number: 12, name: "Responsible Consumption and Production" },
  { number: 13, name: "Climate Action" },
  { number: 14, name: "Life Below Water" },
  { number: 15, name: "Life on Land" },
  { number: 16, name: "Peace, Justice and Strong Institutions" },
  { number: 17, name: "Partnerships for the Goals" },
];

export default function CampaignBasicInfoStep({
  form,
  errors,
  onChange,
  onLocationSelect,
  onNext,
}) {
  return (
    <div className="mx-auto max-w-4xl rounded-[24px] border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-6">
        <h2 className="text-[1.5rem] font-semibold tracking-tight text-slate-900">
          Basic Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Tell us about your campaign
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Campaign Title *
        </label>
        <input
          type="text"
          placeholder="Enter campaign title"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
            errors.title
              ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
              : "border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          }`}
        />
        {errors.title && (
          <p className="mt-2 text-sm text-rose-600">{errors.title}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Description *
        </label>
        <textarea
          rows={5}
          placeholder="Enter campaign description"
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
            errors.description
              ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
              : "border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          }`}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-rose-600">{errors.description}</p>
        )}
      </div>

      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-900">
            SDG Goal *
          </label>
          <select
            value={form.sdgGoalNumber}
            onChange={(e) => onChange("sdgGoalNumber", e.target.value)}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
              errors.sdgGoalNumber
                ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
                : "border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            }`}
          >
            <option value="">Select SDG goal</option>
            {sdgGoals.map((goal) => (
              <option key={goal.number} value={goal.number}>
                Goal {goal.number} - {goal.name}
              </option>
            ))}
          </select>
          {errors.sdgGoalNumber && (
            <p className="mt-2 text-sm text-rose-600">{errors.sdgGoalNumber}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-900">
            End Date *
          </label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
              errors.endDate
                ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
                : "border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            }`}
          />
          {errors.endDate && (
            <p className="mt-2 text-sm text-rose-600">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <MapPicker
          value={form.location}
          onSelect={onLocationSelect}
          error={errors.location}
        />
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}