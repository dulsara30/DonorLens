export default function CampaignAboutCard({ description }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
      <h2 className="text-md font-semibold tracking-tight text-slate-900">
        About This Campaign
      </h2>

      <p className="mt-4 whitespace-pre-line text-md leading-9 text-slate-600">
        {description || "-"}
      </p>
    </div>
  );
}