import { ImagePlus } from "lucide-react";
import { useMemo } from "react";

export default function CampaignMediaStep({
  form,
  errors,
  onFileChange,
  onPrev,
  onNext,
}) {
  const previewUrl = useMemo(() => {
    return form.coverImage ? URL.createObjectURL(form.coverImage) : null;
  }, [form.coverImage]);

  return (
    <div className="mx-auto max-w-4xl rounded-[24px] border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-6">
        <h2 className="text-[1.5rem] font-semibold tracking-tight text-slate-900">
          Media & Documents
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Upload cover image for your campaign
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Cover Image *
        </label>

        <label
          className={`flex min-h-[260px] cursor-pointer items-center justify-center rounded-[20px] border-2 border-dashed bg-slate-50 p-6 transition ${
            errors.coverImage
              ? "border-rose-400"
              : "border-slate-300 hover:border-teal-400"
          }`}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            hidden
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          />

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Cover preview"
              className="max-h-[320px] w-full rounded-xl object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-500">
                <ImagePlus size={24} />
              </div>
              <p className="text-base font-semibold text-slate-700">
                Click to upload cover image
              </p>
              <p className="mt-1 text-sm text-slate-500">
                PNG, JPG up to 5MB
              </p>
            </div>
          )}
        </label>

        {errors.coverImage && (
          <p className="mt-2 text-sm text-rose-600">{errors.coverImage}</p>
        )}
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