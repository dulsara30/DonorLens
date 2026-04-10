import ExecutionCampaignCard from "./ExecutionCampaignCard";

export default function ExecutionCampaignsList({ campaigns, onSelectCampaign }) {
  return (
    <div className="space-y-3">
      {campaigns.map((campaign) => (
        <ExecutionCampaignCard
          key={campaign._id}
          campaign={campaign}
          onSelect={onSelectCampaign}
        />
      ))}
    </div>
  );
}
