import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getPublicCampaignsApi } from "../features/campaigns/api";

const sdgLabels = {
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

const principles = [
  {
    title: "Public campaign goals",
    description:
      "Every campaign publishes its objective, target amount, category, and intended beneficiary before the first donation arrives.",
  },
  {
    title: "Budget visibility",
    description:
      "Planned costs and spending totals are shown side by side so donors can compare intent versus execution.",
  },
  {
    title: "Execution updates",
    description:
      "Campaign owners can publish progress updates, evidence photos, receipts, and milestone notes during delivery.",
  },
  {
    title: "Reviewable records",
    description:
      "System admins and donors can inspect campaign history, creator details, and the latest status without hidden flows.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Campaigns are reviewed",
    text: "NGO requests are checked before public campaigns go live so the platform starts with verified ownership.",
  },
  {
    step: "02",
    title: "Funds stay traceable",
    text: "Raised, planned, and used amounts remain visible on every public campaign detail page.",
  },
  {
    step: "03",
    title: "Execution updates are published",
    text: "Progress logs and evidence files keep the timeline visible as the campaign moves forward.",
  },
  {
    step: "04",
    title: "Impact remains readable",
    text: "Final reports and historical campaign data preserve the record after the campaign ends.",
  },
];

const faqs = [
  {
    question: "How do donors verify a campaign?",
    answer:
      "Open any campaign detail page to check the creator, goal, budget breakdown, funding totals, and execution progress.",
  },
  {
    question: "Can a campaign hide its progress?",
    answer:
      "No. The public page shows the campaign summary, and execution updates are stored as part of the campaign record.",
  },
  {
    question: "What makes this page different from a normal about page?",
    answer:
      "This page focuses on proof, traceability, and live platform data instead of marketing copy.",
  },
];

function formatMoney(value) {
  return new Intl.NumberFormat("en-LK").format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getCampaignOwner(campaign) {
  return (
    campaign?.createdBy?.ngoDetails?.ngoName ||
    campaign?.createdBy?.fullName ||
    campaign?.createdBy?.ngoName ||
    "Campaign creator"
  );
}

function getCampaignProgress(campaign) {
  const raised = Number(campaign?.raisedAmount || 0);
  const used = Number(campaign?.totalUsedAmount || 0);

  if (raised <= 0) return 0;

  return Math.min(Math.round((used / raised) * 100), 100);
}

const MetricCard = ({ label, value, detail }) => (
  <div className="rounded-3xl border border-white/50 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
    <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
      {label}
    </p>
    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
      {value}
    </p>
    <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
  </div>
);

const TransparencyPage = () => {
  const {
    data: campaigns = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["public-campaigns", "transparency"],
    queryFn: async () => {
      const response = await getPublicCampaignsApi({ limit: 200 });
      return response?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const summary = useMemo(() => {
    const totalRaised = campaigns.reduce(
      (total, campaign) => total + Number(campaign?.raisedAmount || 0),
      0,
    );
    const totalUsed = campaigns.reduce(
      (total, campaign) => total + Number(campaign?.totalUsedAmount || 0),
      0,
    );
    const activeCampaigns = campaigns.filter(
      (campaign) => campaign?.status === "ONGOING",
    ).length;
    const completedCampaigns = campaigns.filter(
      (campaign) => campaign?.status === "COMPLETED",
    ).length;
    const creators = new Set(
      campaigns.map(
        (campaign) =>
          campaign?.createdBy?._id ||
          campaign?.createdBy?.id ||
          getCampaignOwner(campaign),
      ),
    ).size;
    const utilizationRate =
      totalRaised > 0
        ? Math.min(Math.round((totalUsed / totalRaised) * 100), 100)
        : 0;

    return {
      totalRaised,
      totalUsed,
      activeCampaigns,
      completedCampaigns,
      creators,
      utilizationRate,
    };
  }, [campaigns]);

  const topGoals = useMemo(() => {
    const counts = campaigns.reduce((accumulator, campaign) => {
      const goal = campaign?.sdgGoalNumber;
      if (!goal) return accumulator;

      accumulator[goal] = (accumulator[goal] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(counts)
      .map(([goal, count]) => ({
        goal: Number(goal),
        count,
        label: sdgLabels[goal] || `Goal ${goal}`,
      }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 3);
  }, [campaigns]);

  const recentCampaigns = useMemo(() => {
    return [...campaigns]
      .sort(
        (left, right) =>
          new Date(right?.updatedAt || 0) - new Date(left?.updatedAt || 0),
      )
      .slice(0, 4);
  }, [campaigns]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="pt-24">
        <section className="relative overflow-hidden px-6 py-16 sm:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_34%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,1))]" />
          <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-60 w-60 rounded-full bg-sky-200/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div className="space-y-6">
              <span className="inline-flex w-fit rounded-full border border-teal-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-teal-700 shadow-sm backdrop-blur">
                Transparency that donors can inspect
              </span>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Every donation should leave a visible trail.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                DonorLens shows campaign goals, budgets, execution updates, and
                historical records in one place so trust is built on evidence,
                not assumptions.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/campaigns"
                  className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(13,148,136,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-teal-700"
                >
                  Browse campaigns
                </Link>
                <Link
                  to="/register/ngo"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-900"
                >
                  Start an NGO request
                </Link>
              </div>
            </div>

            <div className="grid gap-4 rounded-4xl border border-white/60 bg-white/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard
                  label="Live campaigns"
                  value={isLoading ? "..." : campaigns.length}
                  detail="Public campaigns currently available on the platform."
                />
                <MetricCard
                  label="Funds tracked"
                  value={
                    isLoading
                      ? "..."
                      : `LKR ${formatMoney(summary.totalRaised)}`
                  }
                  detail="Total amount raised across visible campaigns."
                />
                <MetricCard
                  label="Utilization rate"
                  value={isLoading ? "..." : `${summary.utilizationRate}%`}
                  detail="How much of the raised amount is reflected in reported usage."
                />
                <MetricCard
                  label="Creators visible"
                  value={isLoading ? "..." : summary.creators}
                  detail="Unique campaign owners represented in the public feed."
                />
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-950 px-6 py-5 text-white shadow-inner">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                      Transparency signal
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">
                      {summary.activeCampaigns} active campaigns,{" "}
                      {summary.completedCampaigns} completed
                    </p>
                  </div>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-teal-200">
                    Live public data
                  </div>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                  The page is powered by the same public campaign data that
                  donors see elsewhere on the platform, so the summary always
                  reflects the current feed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 h-12 w-12 rounded-2xl bg-linear-to-br from-teal-500 to-cyan-500 shadow-[0_14px_30px_rgba(13,148,136,0.2)]" />
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  {principle.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
                    Public ledger
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    Current platform activity
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  Based on the latest public campaign records
                </p>
              </div>

              {isError ? (
                <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                  <p>
                    {error?.message || "Failed to load transparency metrics."}
                  </p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-3 inline-flex rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {recentCampaigns.length > 0 ? (
                    recentCampaigns.map((campaign) => {
                      const progress = getCampaignProgress(campaign);
                      const owner = getCampaignOwner(campaign);
                      const goalLabel =
                        sdgLabels[campaign?.sdgGoalNumber] ||
                        `Goal ${campaign?.sdgGoalNumber || "N/A"}`;

                      return (
                        <article
                          key={campaign?._id}
                          className="rounded-[26px] border border-slate-200 bg-slate-50 p-5"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                                  {goalLabel}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                  {campaign?.status || "UNKNOWN"}
                                </span>
                              </div>
                              <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                                {campaign?.title}
                              </h3>
                              <p className="mt-2 text-sm text-slate-500">
                                by {owner} · updated{" "}
                                {formatDate(campaign?.updatedAt)}
                              </p>
                            </div>

                            <Link
                              to={`/campaigns/${campaign?._id}`}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
                            >
                              Open campaign
                            </Link>
                          </div>

                          <div className="mt-5 grid gap-4 md:grid-cols-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Raised
                              </p>
                              <p className="mt-2 text-2xl font-semibold text-slate-900">
                                LKR {formatMoney(campaign?.raisedAmount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Used
                              </p>
                              <p className="mt-2 text-2xl font-semibold text-slate-900">
                                LKR {formatMoney(campaign?.totalUsedAmount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Progress
                              </p>
                              <p className="mt-2 text-2xl font-semibold text-teal-700">
                                {progress}%
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                            <div
                              className="h-full rounded-full bg-linear-to-r from-teal-500 to-cyan-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="rounded-[26px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                      No public campaigns are available yet. Once campaigns are
                      published, they will appear here automatically.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-4xl border border-slate-200 bg-slate-950 p-8 text-white shadow-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-teal-200">
                  Donation visibility
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  What donors can inspect right now
                </h2>
                <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                  <p>Campaign goals and ownership details</p>
                  <p>Target amounts and reported spend</p>
                  <p>Execution updates and evidence uploads</p>
                  <p>Final reports and historical campaign records</p>
                </div>
              </div>

              <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
                  SDG focus
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Most active goals in the public feed
                </h2>
                <div className="mt-6 space-y-4">
                  {topGoals.length > 0 ? (
                    topGoals.map((item) => (
                      <div
                        key={item.goal}
                        className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Goal {item.goal}
                            </p>
                          </div>
                          <p className="text-xl font-semibold text-teal-700">
                            {item.count}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      SDG data will appear once campaigns are published.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
                  Accountability flow
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  How the platform keeps evidence visible
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Transparency is not a single badge. It is a sequence of
                published details that stays inspectable from approval to final
                report.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[26px] border border-slate-200 bg-slate-50 p-6"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
                    {item.step}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
          <div className="rounded-4xl border border-slate-200 bg-linear-to-br from-teal-600 to-cyan-600 p-8 text-white shadow-[0_24px_70px_rgba(13,148,136,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-50/90">
              Join the standard
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Build campaigns where every update is easy to audit.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-teal-50/90">
              DonorLens is designed so donors, NGOs, and administrators all look
              at the same truth: the same numbers, the same updates, and the
              same historical record.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-teal-700 transition hover:-translate-y-0.5 hover:text-teal-800"
              >
                Explore campaigns
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
                  Quick questions
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Transparency FAQ
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                Answers focused on traceability and visibility
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                    <span className="inline-flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-semibold text-teal-600 shadow-sm">
                        ?
                      </span>
                      {faq.question}
                    </span>
                  </summary>
                  <p className="mt-4 pl-11 text-sm leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TransparencyPage;
