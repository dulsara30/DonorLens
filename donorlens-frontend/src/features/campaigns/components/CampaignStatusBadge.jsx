function getStatusConfig(status) {
  if (status === "ONGOING") {
    return {
      label: "Ongoing",
      className: "bg-emerald-50 text-emerald-600",
    };
  }

  if (status === "COMPLETED") {
    return {
      label: "Completed",
      className: "bg-blue-50 text-blue-600",
    };
  }

  // Don't show anything for other statuses (like CANCELLED)
  return null;
}

export default function CampaignStatusBadge({ status }) {
  const config = getStatusConfig(status);

  // If not ONGOING or COMPLETED → render nothing
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.className}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
}