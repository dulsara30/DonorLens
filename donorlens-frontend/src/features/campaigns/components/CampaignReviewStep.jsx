import { useMemo } from "react";

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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function CampaignReviewStep({
  form,
  submitting,
  submitError,
  onPrev,
  onSubmit,
  submitButtonText = "Submit Campaign",
}) {
  const total = form.financialBreakdown.reduce(
    (sum, item) => sum + Number(item.cost || 0),
    0,
  );

  const selectedGoal = sdgGoals.find(
    (goal) => goal.number === Number(form.sdgGoalNumber),
  );

  const coverPreviewUrl = useMemo(() => {
    if (!form.coverImage) return null;

    // New upload from create form or edit form
    if (form.coverImage instanceof File || form.coverImage instanceof Blob) {
      return URL.createObjectURL(form.coverImage);
    }

    // Existing image object from backend
    if (typeof form.coverImage === "object" && form.coverImage?.secure_url) {
      return form.coverImage.secure_url;
    }

    // Existing raw URL string
    if (typeof form.coverImage === "string") {
      return form.coverImage;
    }

    return null;
  }, [form.coverImage]);

  return (
    <div className="mx-auto max-w-4xl rounded-[24px] border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-6">
        <h2 className="text-[1.5rem] font-semibold tracking-tight text-slate-900">
          Review & Submit
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Review your campaign before submitting
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl border border-slate-200 p-5">
          <h3 className="mb-4 text-md font-semibold text-slate-900">
            Campaign Details
          </h3>

          <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
            <span className="text-slate-500">Title</span>
            <span className="text-slate-900">{form.title || "-"}</span>

            <span className="text-slate-500">SDG Goal</span>
            <span className="text-slate-900">
              {selectedGoal
                ? `Goal ${selectedGoal.number} - ${selectedGoal.name}`
                : "-"}
            </span>

            <span className="text-slate-500">End Date</span>
            <span className="text-slate-900">{form.endDate || "-"}</span>

            <span className="text-slate-500">Location</span>
            <span className="text-slate-900">
              {form.location.locationName || "-"}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 p-5">
          <h3 className="mb-3 text-md font-semibold text-slate-900">
            Description
          </h3>
          <p className="leading-7 text-slate-700">{form.description || "-"}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 p-5">
          <h3 className="mb-3 text-md font-semibold text-slate-900">Media</h3>
          {coverPreviewUrl ? (
            <div className="space-y-3">
              <p className="text-slate-700">Cover image</p>
              <img
                src={coverPreviewUrl}
                alt="Campaign cover preview"
                className="h-56 w-full max-w-md rounded-2xl border border-slate-200 object-cover"
              />
            </div>
          ) : (
            <p className="text-slate-700">No cover image selected</p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 p-5">
          <h3 className="mb-4 text-md font-semibold text-slate-900">
            Budget ({form.financialBreakdown.length} items)
          </h3>

          <div className="space-y-4">
            {form.financialBreakdown.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0 sm:flex-row"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {item.itemName || `Item ${index + 1}`}
                  </p>
                  <p className="text-slate-800 font-medium">
                    {item.description || "-"}
                  </p>
                </div>

                <div className="text-slate-800 font-medium">
                  {formatCurrency(Number(item.cost || 0))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-base text-slate-800 font-medium">
            <span>Total Planned Cost</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {submitError && (
        <p className="mt-4 text-sm font-medium text-rose-600">{submitError}</p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-2xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : submitButtonText}
        </button>
      </div>
    </div>
  );
}
