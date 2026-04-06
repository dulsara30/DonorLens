function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function CampaignFinancialStep({
  form,
  errors,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onPrev,
  onNext,
}) {
  const total = form.financialBreakdown.reduce(
    (sum, item) => sum + Number(item.cost || 0),
    0
  );

  return (
    <div className="mx-auto max-w-4xl rounded-[24px] border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-6">
        <h2 className="text-[1.5rem] font-semibold tracking-tight text-slate-900">
          Financial Breakdown
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Planned budget allocation
        </p>
      </div>

      <div className="space-y-5">
        {form.financialBreakdown.map((item, index) => {
          const itemError = errors.itemErrors?.[index] || {};

          return (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">
                  Item {index + 1}
                </h4>

                {form.financialBreakdown.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(index)}
                    className="text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.itemName}
                    onChange={(e) =>
                      onItemChange(index, "itemName", e.target.value)
                    }
                    className={`w-full rounded-2xl border bg-white px-4 py-3.5 outline-none transition ${
                      itemError.itemName
                        ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
                        : "border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    }`}
                  />
                  {itemError.itemName && (
                    <p className="mt-2 text-sm text-rose-600">
                      {itemError.itemName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    min="0"
                    placeholder="Cost"
                    value={item.cost}
                    onChange={(e) =>
                      onItemChange(index, "cost", e.target.value)
                    }
                    className={`w-full rounded-2xl border bg-white px-4 py-3.5 outline-none transition ${
                      itemError.cost
                        ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
                        : "border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    }`}
                  />
                  {itemError.cost && (
                    <p className="mt-2 text-sm text-rose-600">
                      {itemError.cost}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      onItemChange(index, "description", e.target.value)
                    }
                    className={`w-full rounded-2xl border bg-white px-4 py-3.5 outline-none transition ${
                      itemError.description
                        ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
                        : "border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    }`}
                  />
                  {itemError.description && (
                    <p className="mt-2 text-sm text-rose-600">
                      {itemError.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {errors.financialBreakdown && (
        <p className="mt-3 text-sm text-rose-600">{errors.financialBreakdown}</p>
      )}

      <button
        type="button"
        onClick={onAddItem}
        className="mt-5 text-sm w-full rounded-2xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-50"
      >
        + Add Budget Item
      </button>

      <div className="mt-6 flex items-center justify-between rounded-3xl bg-emerald-50 px-5 py-5">
        <div>
          <h3 className="text-medium font-bold text-slate-900">Total Planned Cost</h3>
          <p className="mt-1 text-sm text-slate-500">
            Auto-calculated from budget items
          </p>
        </div>

        <strong className="text-xl font-bold text-teal-600">
          {formatCurrency(total)}
        </strong>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}