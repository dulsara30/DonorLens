// Main landing page for DonorLens - showcasing transparency and impact

// import Header from "../components/layout/Header";
// import HeroSection from "../components/layout/HeroSection.jsx";
// import CampaignGrid from "../components/layout/CampaignGrid";
// import ImpactSection from "../components/layout/ImpactSection";
// import AboutSection from "../components/layout/AboutSection";
// import Footer from "../components/layout/Footer";

// const HomePage = () => {
//   return (
//     <div className="animate-fade-in bg-white">
//       <Header />
//       <HeroSection />
//       <CampaignGrid />
      
//       {/* See More Campaigns CTA Section */}
//       <section className="py-16 text-center bg-white transition-all duration-700 ease-in-out animate-slide-in-up [animation-delay:0.4s]">
//         <button className="px-10 py-3.5 bg-transparent text-teal-600 border-2 border-teal-600 rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 hover:bg-teal-600 hover:text-white hover:shadow-md">
//           View All Campaigns
//         </button>
//       </section>

//       <ImpactSection />
//       <AboutSection />
//       <Footer />
//     </div>
//   );
// };

// export default HomePage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import HeroSection from "../components/layout/HeroSection.jsx";
import CampaignGrid from "../components/layout/CampaignGrid";
import ImpactSection from "../components/layout/ImpactSection";
import AboutSection from "../components/layout/AboutSection";
import Footer from "../components/layout/Footer";
import { getPublicCampaignsApi } from "../features/campaigns/api";

const HomePage = () => {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    fetchHomeCampaigns();
  }, []);

  const fetchHomeCampaigns = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getPublicCampaignsApi({
        status: "ONGOING",
        limit: 6,
      });

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
    <div className="animate-fade-in bg-white">
      <Header />
      <HeroSection />

      <CampaignGrid
        title="Ongoing Campaigns"
        subtitle="Support transparent initiatives making real impact in communities worldwide"
        campaigns={campaigns}
        loading={loading}
        error={pageError}
      />

      <section className="bg-white py-16 text-center transition-all duration-700 ease-in-out animate-slide-in-up [animation-delay:0.4s]">
        <button
          onClick={() => navigate("/campaigns")}
          className="cursor-pointer rounded-lg border-2 border-teal-600 bg-transparent px-10 py-3.5 text-base font-semibold text-teal-600 transition-all duration-200 hover:bg-teal-600 hover:text-white hover:shadow-md"
        >
          View All Campaigns
        </button>
      </section>

      <ImpactSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default HomePage;
