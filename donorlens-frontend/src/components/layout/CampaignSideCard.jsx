import { Heart, CheckCircle2 } from "lucide-react";

function formatNumber(value) {
  return new Intl.NumberFormat("en-LK").format(Number(value || 0));
}

export default function CampaignSideCard({ campaign }) {
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

  return (
    <div className="sticky top-8 rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-sm">
      <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
        <p className="text-lg font-medium text-slate-500">Donation area</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          You can add donation fields or payment integrations here later.
        </p>
      </div>

      <button
        type="button"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-4 text-md font-semibold text-white transition hover:bg-teal-700"
      >
        <Heart size={20} />
        <span>Donate Now</span>
      </button>
    </div>
  );
}