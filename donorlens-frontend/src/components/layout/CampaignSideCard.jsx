import { Heart, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatNumber(value) {
  return new Intl.NumberFormat("en-LK").format(Number(value || 0));
}

export default function CampaignSideCard({ campaign }) {
  const navigate = useNavigate();
  const isCompleted = campaign?.status === "COMPLETED";

  if (isCompleted) {
    return (
      <div className="sticky top-8 rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <div className="rounded-[22px] bg-blue-50 px-6 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
            <CheckCircle2 size={28} />
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Campaign Completed
          </p>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            Donations Closed
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            This campaign has been completed successfully and is no longer
            accepting donations.
          </p>

          <div className="mt-6 rounded-2xl bg-white px-5 py-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Final Raised Amount
            </p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-blue-700">
              <span className="mr-1 align-middle text-sm font-medium text-blue-600">
                LKR
              </span>
              {formatNumber(campaign?.raisedAmount)}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled
          className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-slate-200 px-6 py-4 text-md font-semibold text-slate-500"
        >
          Donations Closed
        </button>
      </div>
    );
  }

  const raised = Number(campaign?.raisedAmount || 0);
  const goal = Number(campaign?.totalPlannedCost || 0);
  const progress = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

  return (
    <div className="sticky top-8 rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-sm">
      {/* Fundraising summary */}
      <div className="rounded-[22px] bg-teal-50 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
          Fundraising Goal
        </p>

        <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
          <span className="mr-1 align-middle text-sm font-medium text-teal-600">LKR</span>
          {formatNumber(raised)}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          raised of{" "}
          <span className="font-semibold text-slate-700">LKR {formatNumber(goal)}</span>
        </p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1.5 text-right text-xs font-semibold text-teal-700">{progress}%</p>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">
        Every contribution makes a real difference.
      </p>

      <button
        type="button"
        onClick={() => navigate(`/campaigns/${campaign._id}/donate`)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-4 text-md font-semibold text-white transition hover:bg-teal-700 active:scale-95"
      >
        <Heart size={20} />
        <span>Donate Now</span>
      </button>
    </div>
  );
}