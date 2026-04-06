import CampaignBudgetList from "./CampaignBudgetList";

// function formatCurrency(value) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "LKR",
//     maximumFractionDigits: 0,
//   }).format(Number(value || 0));
// }

export default function CampaignFinancialSummaryCard({ campaign }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
      <h2 className="text-md font-semibold tracking-tight text-slate-900">
        Financial Summary
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[20px] bg-slate-50 px-5 py-5">
          <p className="text-sm font-medium text-slate-500">Funds Raised</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-teal-700">
            <span className="mr-1 align-middle text-sm font-medium text-teal-600">LKR</span>
            {Number(campaign.raisedAmount || 0).toLocaleString("en-LK")}
          </p>
        </div>

        <div className="rounded-[20px] bg-slate-50 px-5 py-5">
          <p className="text-sm font-medium text-slate-500">Funds Used</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-teal-700">
            <span className="mr-1 align-middle text-sm font-medium text-teal-600">LKR</span>
            {Number(campaign.totalUsedAmount || 0).toLocaleString("en-LK")}
          </p>
        </div>

        <div className="rounded-[20px] bg-slate-50 px-5 py-5">
          <p className="text-sm font-medium text-slate-500">Total Allocated</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-teal-700">
            <span className="mr-1 align-middle text-sm font-medium text-teal-600">LKR</span>
            {Number(campaign.totalPlannedCost || 0).toLocaleString("en-LK")}
          </p>
        </div>
      </div>

      <CampaignBudgetList financialBreakdown={campaign.financialBreakdown} />
    </div>
  );
}