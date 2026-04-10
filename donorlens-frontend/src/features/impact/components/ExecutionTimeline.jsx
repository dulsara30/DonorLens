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
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="relative">
        {/* Timeline Container */}
        <div className="space-y-2">
          {/* Real Executions - sorted by date (newest first) */}
          {sortedExecutions.map((execution) => (
            <div key={execution._id}>
              <ExecutionCard
                execution={execution}
                campaign={campaign}
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
