// src/components/layout/CampaignGrid.jsx
// Grid of ongoing campaign cards (static UI placeholders)

const CampaignGrid = () => {
  // Static placeholder campaigns
  const campaigns = [
    {
      id: 1,
      title: "Clean Water for Rural Communities",
      description: "Providing sustainable clean water access to 500 families in remote villages.",
      progress: 65,
      raised: "32,500",
      goal: "50,000",
      image: "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Education for Underprivileged Children",
      description: "Building and equipping classrooms for 200 children in underserved areas.",
      progress: 45,
      raised: "18,000",
      goal: "40,000",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Healthcare Support Program",
      description: "Providing essential medical supplies and services to local health centers.",
      progress: 80,
      raised: "24,000",
      goal: "30,000",
      image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Food Security Initiative",
      description: "Delivering nutritious meals to 150 families facing food insecurity.",
      progress: 55,
      raised: "16,500",
      goal: "30,000",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Women Empowerment Workshop",
      description: "Skills training and microfinance support for 100 women entrepreneurs.",
      progress: 72,
      raised: "21,600",
      goal: "30,000",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Emergency Disaster Relief",
      description: "Immediate assistance to families affected by recent natural disasters.",
      progress: 38,
      raised: "11,400",
      goal: "30,000",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-20 px-8 bg-gradient-to-b from-slate-50/50 to-white transition-all duration-700 ease-in-out">
      <div className="max-w-[1400px] mx-auto animate-fade-in">
        <div className="text-center mb-16 animate-[fadeInUp_0.8s_cubic-bezier(0.4,0,0.2,1)]">
          <h2 className="text-4xl font-extrabold text-slate-900 m-0 mb-4">
            Ongoing Campaigns
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed m-0 max-w-3xl mx-auto">
            Support transparent initiatives making real impact in communities worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign, index) => (
            <div 
              key={campaign.id}
              style={{ '--card-index': index }}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:border-teal-200 animate-card-fade-in [animation-delay:calc(var(--card-index)*0.1s)]"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={campaign.image} 
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
              </div>
              
              <div className="p-6 flex flex-col gap-4">
                <h3 className="text-xl font-bold text-slate-800 m-0 leading-snug line-clamp-2">
                  {campaign.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed m-0 line-clamp-3">
                  {campaign.description}
                </p>
                
                <div className="flex flex-col gap-2">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] before:bg-[length:200%_100%] before:animate-shimmer">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-primary via-teal-secondary to-teal-light rounded-full transition-all duration-700 bg-[length:200%_100%] animate-gradient-shift"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-teal-primary text-base">
                      ${campaign.raised} raised
                    </span>
                    <span className="text-slate-500">of ${campaign.goal}</span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-teal-600 text-white border-none rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 hover:bg-teal-700 hover:shadow-md">
                  View Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampaignGrid;
