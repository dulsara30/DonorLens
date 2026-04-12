import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPublicSingleCampaignApi } from "../features/campaigns/api";
import CampaignSideCard from "../components/layout/CampaignSideCard";
import ExecutionUpdates from "../features/impact/components/ExecutionUpdates";

const sdgGoals = {
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

function formatNumber(value) {
  return new Intl.NumberFormat("en-LK").format(Number(value || 0));
}

function getStatusLabel(status) {
  if (status === "ONGOING") return "Ongoing";
  if (status === "COMPLETED") return "Completed";
  return status;
}

function getStatusClasses(status) {
  if (status === "COMPLETED") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-emerald-50 text-emerald-700";
}

export default function PublicCampaignDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getPublicSingleCampaignApi(id);
      setCampaign(response?.data || null);
    } catch (error) {
      console.error(error);
      setPageError(
        error?.response?.data?.message || "Failed to load campaign details"
      );
    } finally {
      setLoading(false);
    }
  };

  const executionProgress = useMemo(() => {
    if (!campaign) return 0;

    const raised = Number(campaign.raisedAmount || 0);
    const used = Number(campaign.totalUsedAmount || 0);

    if (raised <= 0) return 0;

    return Math.min(Math.round((used / raised) * 100), 100);
  }, [campaign]);

  const foundationName =
    campaign?.createdBy?.ngoDetails?.ngoName ||
    campaign?.createdBy?.ngoName ||
    "Foundation Name";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white px-8 py-10 shadow-sm">
          <p className="text-sm text-slate-500">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-rose-200 bg-rose-50 px-8 py-10 shadow-sm">
          <p className="text-sm text-rose-600">{pageError}</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/campaigns")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          <span>Back to Campaigns</span>
        </button>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="h-[320px] w-full bg-slate-100 sm:h-[420px]">
                <img
                  src={campaign.coverImage?.secure_url}
                  alt={campaign.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="px-8 py-8">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
                    {sdgGoals[campaign.sdgGoalNumber] || `Goal ${campaign.sdgGoalNumber}`}
                  </span>

                  <span
                    className={`rounded-full px-4 py-1.5 text-sm font-medium ${getStatusClasses(
                      campaign.status
                    )}`}
                  >
                    {getStatusLabel(campaign.status)}
                  </span>
                </div>

                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  {campaign.title}
                </h1>

                <p className="mt-3 text-sm text-slate-500">
                  by{" "}
                  <span className="font-semibold text-slate-900">
                    {foundationName}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-sm">
              <h2 className="text-md font-semibold tracking-tight text-slate-900">
                About This Campaign
              </h2>

              <p className="mt-6 whitespace-pre-line text-md leading-9 text-slate-600">
                {campaign.description}
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-sm">
              <h2 className="text-md font-semibold tracking-tight text-slate-900">
                Financial Summary
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[22px] bg-slate-50 px-6 py-6">
                  <p className="text-sm font-medium text-slate-500">
                    Funds Raised
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-teal-700">
                    <span className="mr-1 align-middle text-sm font-medium text-teal-600">
                      LKR
                    </span>
                    {formatNumber(campaign.raisedAmount)}
                  </p>
                </div>

                <div className="rounded-[22px] bg-slate-50 px-6 py-6">
                  <p className="text-sm font-medium text-slate-500">
                    Funds Used
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-teal-600">
                    <span className="mr-1 align-middle text-sm font-medium text-teal-600">
                      LKR
                    </span>
                    {formatNumber(campaign.totalUsedAmount)}
                  </p>
                </div>

                <div className="rounded-[22px] bg-slate-50 px-6 py-6">
                  <p className="text-sm font-medium text-slate-500">
                    Total Allocated
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-teal-700">
                    <span className="mr-1 align-middle text-sm font-medium text-teal-600">
                      LKR
                    </span>
                    {formatNumber(campaign.totalPlannedCost)}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    Execution Progress
                  </p>
                  <p className="text-base font-semibold text-teal-700">
                    {executionProgress}%
                  </p>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: `${executionProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-md font-semibold text-slate-900">
                  Budget Allocation
                </h3>

                <div className="mt-5 overflow-hidden rounded-[22px] border border-slate-200">
                  {campaign.financialBreakdown?.length > 0 ? (
                    campaign.financialBreakdown.map((item, index) => (
                      <div
                        key={`${item.itemName}-${index}`}
                        className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 last:border-b-0 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-md font-medium text-slate-900">
                            {item.itemName}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {item.description || "No description"}
                          </p>
                        </div>

                        <div className="text-md font-medium text-slate-900 sm:text-right">
                          <span className="mr-1 text-xs font-medium text-slate-500">
                            LKR
                          </span>
                          {formatNumber(item.cost)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-5 text-sm text-slate-500">
                      No budget items available.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-sm">
              <ExecutionUpdates 
                campaignId={id} 
                raisedAmount={campaign.raisedAmount} 
                totalPlannedCost={campaign.totalPlannedCost}
              />
            </div>
          </div>

          <div>
            <CampaignSideCard campaign={campaign} />
          </div>
        </div>
      </div>
    </div>
  );
}