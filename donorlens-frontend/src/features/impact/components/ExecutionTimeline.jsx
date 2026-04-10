import ExecutionCard from "./ExecutionCard";

function getDefaultLaunchExecution(campaign) {
  return {
    _id: "default-launch",
    title: "Campaign Launched",
    date: campaign?.createdAt || new Date(),
    description: `We are excited to launch this campaign for ${campaign?.description || "our cause"}.`,
    fundsUsed: 0,
    progress: 0,
    evidencePhotos: [],
    receipts: [],
    isDefault: true,
  };
}

export default function ExecutionTimeline({
  sortedExecutions,
  campaign,
  onDelete,
}) {
  // Calculate cumulative funds used up to each execution
  // Sort chronologically (oldest to newest) for correct cumulative calculation
  const chronologicalExecutions = [...sortedExecutions].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const executionsWithCumulativeProgress = sortedExecutions.map((execution) => {
    // Find the index in chronological order
    const chronoIndex = chronologicalExecutions.findIndex(e => e._id === execution._id);
    
    // Calculate cumulative from chronological position
    const cumulativeFundsUsed = chronologicalExecutions
      .slice(0, chronoIndex + 1)
      .reduce((sum, exe) => sum + (exe.fundsUsed || 0), 0);
    
    console.log("📈 Cumulative Progress Calc:", {
      title: execution.title,
      date: execution.date,
      chronoIndex,
      fundsUsed: execution.fundsUsed,
      cumulativeFundsUsed,
    });
    
    return {
      ...execution,
      cumulativeFundsUsed,
    };
  });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="relative">
        {/* Timeline Container */}
        <div className="space-y-6">
          {/* Real Executions - sorted by date (newest first) */}
          {executionsWithCumulativeProgress.map((execution) => (
            <div key={execution._id} className="border-b border-slate-100 pb-6 last:border-b-0">
              <ExecutionCard
                execution={execution}
                campaign={campaign}
                cumulativeFundsUsed={execution.cumulativeFundsUsed}
                onDelete={() => onDelete(execution._id)}
                onEdit={() => {
                  // TODO: Implement edit functionality
                  console.log("Edit execution:", execution._id);
                }}
              />
            </div>
          ))}

          {/* Default Launch Execution - shown at the bottom */}
          <div>
            <ExecutionCard
              execution={getDefaultLaunchExecution(campaign)}
              campaign={campaign}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
