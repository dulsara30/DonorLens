export default function CampaignMediaReadOnlyStep({
  coverImageUrl,
  onPrev,
  onNext,
}) {
  return (
    <div className="mx-auto max-w-4xl rounded-[24px] border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-6">
        <h2 className="text-[2rem] font-semibold tracking-tight text-slate-900">
          Media & Documents
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Cover image preview. Image updating is currently unavailable.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Cover Image
        </label>

        <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt="Campaign cover"
              className="max-h-[320px] w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
              No cover image available
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Previous
        </button>

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