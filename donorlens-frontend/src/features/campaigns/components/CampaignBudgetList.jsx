function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function CampaignBudgetList({ financialBreakdown = [] }) {
  return (
    <div className="mt-8">
      <h3 className="text-md font-semibold text-slate-900">
        Budget Allocation
      </h3>

      <div className="mt-4 overflow-hidden rounded-[20px] border border-slate-200">
        {financialBreakdown.length === 0 ? (
          <div className="px-5 py-5 text-sm text-slate-500">
            No budget items available.
          </div>
        ) : (
          financialBreakdown.map((item, index) => (
            <div
              key={`${item.itemName}-${index}`}
              className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-base font-medium text-slate-900">
                  {item.itemName}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>

              <div className="text-base font-medium text-slate-800 sm:text-right">
                {formatCurrency(item.cost)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}