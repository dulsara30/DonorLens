import { useNavigate } from "react-router-dom";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getProgress(raised, total) {
  const safeTotal = Number(total || 0);
  const safeRaised = Number(raised || 0);

  if (safeTotal <= 0) return 0;
  return Math.min((safeRaised / safeTotal) * 100, 100);
}

export default function CampaignGrid({
  title = "Campaigns",
  subtitle = "Explore campaigns making a real impact.",
  campaigns = [],
  loading = false,
  error = "",
  hideHeader = false,
  emptyMessage = "No campaigns available at the moment.",
}) {
  const navigate = useNavigate();

  return (
    <section className={hideHeader ? "" : "bg-gradient-to-b from-slate-50/50 to-white px-8 py-20 transition-all duration-700 ease-in-out"}>
      <div className={`mx-auto animate-fade-in ${hideHeader ? "" : "max-w-[1400px]"}`}>
        {!hideHeader && (
          <div className="mb-16 text-center animate-[fadeInUp_0.8s_cubic-bezier(0.4,0,0.2,1)]">
            <h2 className="m-0 mb-4 text-4xl font-extrabold text-slate-900">
              {title}
            </h2>
            <p className="mx-auto m-0 max-w-3xl text-lg leading-relaxed text-slate-600">
              {subtitle}
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center text-base text-slate-500">
            Loading campaigns...
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-base text-rose-600">{error}</div>
        )}

        {!loading && !error && campaigns.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center text-base text-slate-500">
            {emptyMessage}
          </div>
        )}

        {!loading && !error && campaigns.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign, index) => {
              const progress = getProgress(
                campaign.raisedAmount,
                campaign.totalPlannedCost
              );

              return (
                <div
                  key={campaign._id}
                  style={{ "--card-index": index }}
                  className="animate-card-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-in-out [animation-delay:calc(var(--card-index)*0.1s)] hover:-translate-y-2 hover:border-teal-200 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={campaign.coverImage?.secure_url}
                      alt={campaign.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col gap-4 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="m-0 line-clamp-2 text-xl font-bold leading-snug text-slate-800">
                        {campaign.title}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          campaign.status === "COMPLETED"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-teal-50 text-teal-700"
                        }`}
                      >
                        {campaign.status === "COMPLETED"
                          ? "Completed"
                          : "Ongoing"}
                      </span>
                    </div>

                    <p className="m-0 line-clamp-3 text-base leading-relaxed text-slate-600">
                      {campaign.description}
                    </p>

                    <div className="flex flex-col gap-2">
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            campaign.status === "COMPLETED"
                              ? "bg-blue-600"
                              : "bg-teal-600"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={`text-base font-bold ${
                            campaign.status === "COMPLETED"
                              ? "text-blue-700"
                              : "text-teal-700"
                          }`}
                        >
                          LKR {formatCurrency(campaign.raisedAmount)} raised
                        </span>
                        <span className="text-slate-500">
                          of LKR {formatCurrency(campaign.totalPlannedCost)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/campaigns/${campaign._id}`)}
                      className={`w-full cursor-pointer rounded-lg border-none px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:shadow-md ${
                        campaign.status === "COMPLETED"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-teal-600 hover:bg-teal-700"
                      }`}
                    >
                      View Campaign
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}