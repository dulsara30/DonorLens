import { Eye, Pencil, Trash2, MapPin } from "lucide-react";
import CampaignStatusBadge from "./CampaignStatusBadge";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function MyCampaignCard({
  campaign,
  deleting,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-5">
          <div className="h-24 w-36 shrink-0 overflow-hidden rounded-[18px] bg-slate-100">
            <img
              src={campaign.coverImage?.secure_url}
              alt={campaign.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
                <h3 className="truncate text-[1rem] font-semibold tracking-tight text-slate-900">
                    {campaign.title}
                </h3>

                <CampaignStatusBadge status={campaign.status} />
            </div>

            {/* Raised / Total */}
            <p className="text-base text-slate-600">
                {formatCurrency(campaign.raisedAmount)} /{" "}
                {formatCurrency(campaign.totalPlannedCost)}
            </p>

            {/* Location */}
            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin size={14} className="shrink-0 text-slate-400" />
                <span className="truncate">
                    {campaign.location?.locationName || "No location"}
                </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            {/* View */}
            <button
                type="button"
                onClick={onView}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
                <Eye size={16} />
                <span>View</span>
            </button>

            {/* Update */}
            <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
                <Pencil size={16} />
                <span>Update</span>
            </button>

            {/* Delete */}
            <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                title="Delete campaign"
            >
                <Trash2 size={16} />
            </button>
        </div>
      </div>
    </div>
  );
}
