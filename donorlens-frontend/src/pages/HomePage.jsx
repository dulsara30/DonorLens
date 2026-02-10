// Main landing page for DonorLens - showcasing transparency and impact

import Header from "../components/layout/Header";
import HeroSection from "../components/layout/HeroSection.jsx";
import CampaignGrid from "../components/layout/CampaignGrid";
import ImpactSection from "../components/layout/ImpactSection";
import AboutSection from "../components/layout/AboutSection";
import Footer from "../components/layout/Footer";

const HomePage = () => {
  return (
    <div className="animate-fade-in bg-white">
      <Header />
      <HeroSection />
      <CampaignGrid />
      
      {/* See More Campaigns CTA Section */}
      <section className="py-16 text-center bg-white transition-all duration-700 ease-in-out animate-slide-in-up [animation-delay:0.4s]">
        <button className="px-10 py-3.5 bg-transparent text-teal-600 border-2 border-teal-600 rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 hover:bg-teal-600 hover:text-white hover:shadow-md">
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
