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

export default function ExecutionEmptyState({ campaign }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="relative">
        {/* Timeline Container */}
        <div className="space-y-2">
          {/* Default Launch Execution */}
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
