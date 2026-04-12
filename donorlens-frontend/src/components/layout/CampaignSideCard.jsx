import { Heart, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function formatNumber(value) {
  return new Intl.NumberFormat("en-LK").format(Number(value || 0));
}

export default function CampaignSideCard({ campaign }) {
  const isCompleted = campaign?.status === "COMPLETED";

  const { id } = useParams();

  const raised = Number(campaign?.raisedAmount || 0);
  const goal = Number(campaign?.totalPlannedCost || 0);
  const progressPercent =
    goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

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

  return (
    <div className="sticky top-8 rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-sm text-center">
      <div className="rounded-[22px] bg-[#f2fbf8] px-6 py-8 text-left border border-teal-50">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0e8a71] mb-4">
          Fundraising Goal
        </p>

        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-[#0e8a71]">LKR</span>
          <span className="text-5xl font-semibold tracking-tight text-slate-900">
            {formatNumber(raised)}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          raised of{" "}
          <span className="font-bold text-slate-700">
            LKR {formatNumber(goal)}
          </span>
        </p>

        <div className="mt-5">
          <div className="h-[10px] w-full overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-inset ring-slate-100">
            <div
              className="h-full rounded-full bg-[#0e8a71]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-end">
            <span className="text-[13px] font-bold text-[#0e8a71]">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      <p className="mt-6 px-4 text-[13px] text-slate-500">
        Every contribution makes a real difference.
      </p>

      {campaign?._id ? (
        <Link
          to={`/campaigns/${id}/donate`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#008f7a] px-6 py-[18px] text-[15px] font-semibold text-white transition shadow-sm hover:bg-[#007a68] no-underline"
        >
          <Heart size={20} className="fill-transparent stroke-[2.5]" />
          <span>Donate Now</span>
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-300 px-6 py-4 text-md font-semibold text-white opacity-70"
        >
          <Heart size={20} />
          <span>Donate Now</span>
        </button>
      )}
    </div>
  );
}
