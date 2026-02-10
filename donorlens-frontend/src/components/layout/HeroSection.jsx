// Hero section with gradient background and full-page background image

import { Link } from "react-router-dom";
import backgroundImg from "../../assets/background.png";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-8 py-20 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle overlay to blend with page background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-cyan-50/20 to-teal-50/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between gap-16 max-lg:flex-col animate-fade-in">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-6xl leading-tight font-extrabold text-indigo-900 m-0 max-md:text-4xl">
            See Where Your <br /> Good Goes
          </h1>
          <p className="text-lg leading-relaxed text-slate-700 m-0 max-w-xl">
            Track your donations with complete transparency and see the real-world impact your generosity creates.
          </p>
          <div className="flex gap-4 mt-4">
            <Link 
              to="/campaigns" 
              className="px-7 py-3.5 bg-teal-600 text-white rounded-lg font-semibold text-base hover:bg-teal-700 hover:shadow-lg transition-all duration-200 no-underline"
            >
              Explore Campaigns
            </Link>
            <Link 
              to="/transparency" 
              className="px-7 py-3.5 bg-white text-slate-700 rounded-lg font-semibold text-base hover:bg-slate-50 hover:shadow-md transition-all duration-200 no-underline"
            >
              How It Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
