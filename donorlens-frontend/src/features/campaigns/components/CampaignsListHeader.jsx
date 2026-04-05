import { Plus } from "lucide-react";

export default function MyCampaignListHeader({ count, onCreateNew }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-base font-medium text-slate-500">
        {count} campaign(s)
      </p>

      <button
        type="button"
        onClick={onCreateNew}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
      >
        <Plus size={18} />
        <span>New Campaign</span>
      </button>
    </div>
  );
}