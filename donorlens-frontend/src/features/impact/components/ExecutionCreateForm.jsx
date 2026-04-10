import { useMemo, useState } from "react";
import { Calendar, ImagePlus, Receipt, Save, X, AlertCircle, Loader } from "lucide-react";
import { useExecutionStore } from "../store/executionStore";

const initialForm = {
  title: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  fundsUsed: "",
};

export default function ExecutionCreateForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialForm);
  const [evidencePhotos, setEvidencePhotos] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading } = useExecutionStore();

  const evidencePreviewUrls = useMemo(() => {
    return evidencePhotos.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [evidencePhotos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError("");
  };

  const handleEvidenceChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setLocalError("Maximum 5 evidence photos allowed");
      return;
    }
    setEvidencePhotos(files);
    setLocalError("");
  };

  const handleReceiptsChange = (e) => {
    const files = Array.from(e.target.files || []);
    setReceipts(files);
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!formData.title.trim()) {
      setLocalError("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      setLocalError("Description is required");
      return;
    }

    if (!formData.fundsUsed || formData.fundsUsed < 0) {
      setLocalError("Funds used must be a valid positive number");
      return;
    }

    if (evidencePhotos.length === 0) {
      setLocalError("At least one evidence photo is required");
      return;
    }

    const payload = {
      ...formData,
      evidencePhotos,
      receipts,
    };

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(payload);
      }
      // Reset form on success
      setFormData(initialForm);
      setEvidencePhotos([]);
      setReceipts([]);
    } catch (error) {
      console.error("Form submission error:", error);
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">
          New Execution Update
        </h2>

        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting || loading}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        >
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Local Error */}
          {localError && (
            <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-600" />
              <p className="text-sm text-rose-800">{localError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Update title"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                required
                maxLength={150}
                disabled={isSubmitting || loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  disabled={isSubmitting || loading}
                />
                <Calendar
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what was accomplished"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              required
              maxLength={500}
              disabled={isSubmitting || loading}
            />
            <p className="mt-1 text-xs text-slate-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Funds Used (LKR) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="fundsUsed"
              value={formData.fundsUsed}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter funds used"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              required
              disabled={isSubmitting || loading}
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-800">
              Evidence Photos <span className="text-rose-500">*</span>
            </label>

            <label className="flex min-h-25 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 transition hover:border-teal-600 hover:bg-teal-50 disabled:opacity-50">
              <div className="flex flex-col items-center gap-2 text-center">
                <ImagePlus className="text-slate-500" size={24} />
                <p className="text-xs font-medium text-slate-700">
                  Upload evidence photos
                </p>
                <p className="text-xs text-slate-500">
                  JPG, PNG, WEBP — up to 5 files
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleEvidenceChange}
                className="hidden"
                disabled={isSubmitting || loading}
              />
            </label>

            {evidencePreviewUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {evidencePreviewUrls.map((item, index) => (
                  <img
                    key={`${item.file.name}-${index}`}
                    src={item.url}
                    alt={item.file.name}
                    className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-800">
              Bills / Receipts
            </label>

            <label className="flex min-h-20 cursor-pointer items-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-teal-600 hover:bg-teal-50">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Receipt size={18} className="text-slate-500" />
                <span>Upload receipts (PDF, Images)</span>
              </div>

              <input
                type="file"
                multiple
                onChange={handleReceiptsChange}
                className="hidden"
                disabled={isSubmitting || loading}
              />
            </label>

            {receipts.length > 0 && (
              <div className="mt-3 space-y-2">
                {receipts.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    <Receipt size={14} className="text-slate-400" />
                    <span className="truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border-t border-slate-200 pt-6">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting || loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Update
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || loading}
              className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
}