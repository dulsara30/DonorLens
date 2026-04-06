import CampaignStatusBadge from "./CampaignStatusBadge";
import { MapPin } from "lucide-react";

function getGoalName(goalNumber) {
  const goalMap = {
    1: "No Poverty",
    2: "Zero Hunger",
    3: "Good Health and Well-being",
    4: "Quality Education",
    5: "Gender Equality",
    6: "Clean Water and Sanitation",
    7: "Affordable and Clean Energy",
    8: "Decent Work and Economic Growth",
    9: "Industry, Innovation and Infrastructure",
    10: "Reduced Inequalities",
    11: "Sustainable Cities and Communities",
    12: "Responsible Consumption and Production",
    13: "Climate Action",
    14: "Life Below Water",
    15: "Life on Land",
    16: "Peace, Justice and Strong Institutions",
    17: "Partnerships for the Goals",
  };

  return goalMap[goalNumber] || `Goal ${goalNumber}`;
}

export default function CampaignDetailsHero({ campaign }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="h-[320px] w-full bg-slate-100 sm:h-[420px]">
        <img
          src={campaign.coverImage?.secure_url}
          alt={campaign.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="px-6 py-6 sm:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
            {getGoalName(campaign.sdgGoalNumber)}
          </span>

          <CampaignStatusBadge status={campaign.status} />
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {campaign.title}
        </h1>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={16} className="text-slate-400" />
          <span>{campaign.location?.locationName || "No location"}</span>
        </div>
      </div>
    </div>
  );
}