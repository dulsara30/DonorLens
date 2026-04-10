import { ChevronRight, MapPin } from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function ExecutionCampaignCard({ campaign, onSelect }) {
  return (
    <button
      onClick={() => onSelect(campaign._id)}
      className="w-full rounded-[18px] border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          {/* Campaign Image */}
          <div className="h-20 w-28 shrink-0 overflow-hidden rounded-[14px] bg-slate-100">
            <img
              src={campaign.coverImage?.secure_url}
              alt={campaign.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Campaign Info */}
          <div className="flex-1 text-left">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {campaign.title}
            </h3>

            {/* Progress Bar */}
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-teal-600"
                  style={{
                    width: `${
                      (campaign.raisedAmount / campaign.totalPlannedCost) * 100 || 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500">
                {Math.round(
                  (campaign.raisedAmount / campaign.totalPlannedCost) * 100 || 0
                )}%
              </span>
            </div>

            {/* Amount & Location */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="font-semibold text-teal-600">
                {formatCurrency(campaign.raisedAmount)} /{" "}
                {formatCurrency(campaign.totalPlannedCost)}
              </span>

              {campaign.location?.locationName && (
                <>
                  <span className="text-slate-400">•</span>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin size={12} />
                    <span className="truncate">{campaign.location.locationName}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Chevron Icon */}
        <div className="flex shrink-0 items-center justify-center text-teal-600">
          <ChevronRight size={20} />
        </div>
      </div>
    </button>
  );
}
