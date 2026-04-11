import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CampaignGrid from "../components/layout/CampaignGrid";
import { getPublicCampaignsApi } from "../features/campaigns/api";

export default function PublicCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    fetchPublicCampaigns();
  }, []);

  const fetchPublicCampaigns = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getPublicCampaignsApi();
      setCampaigns(response?.data || []);
    } catch (error) {
      console.error(error);
      setPageError(
        error?.response?.data?.message || "Failed to load campaigns"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="px-8 pt-15 pb-16 bg-gradient-to-b from-slate-50/50 to-white">
        <CampaignGrid
          title="Campaigns"
          subtitle="Discover ongoing and completed campaigns making a real difference across communities."
          campaigns={campaigns}
          loading={loading}
          error={pageError}
        />
      </section>
      

      <Footer />
    </div>
  );
}