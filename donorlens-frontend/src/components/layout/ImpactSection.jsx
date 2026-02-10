// Showcasing executed projects and real-world impact

const ImpactSection = () => {
  // Static placeholder for executed projects
  const executedProjects = [
    {
      id: 1,
      name: "School Renovation Project 2025",
      impact: "300 students now learning in safe, modern facilities",
      beneficiaries: "300 Students",
      location: "Rural Kenya",
      year: "2025"
    },
    {
      id: 2,
      name: "Community Well Construction",
      impact: "120 families with access to clean drinking water",
      beneficiaries: "120 Families",
      location: "Bangladesh",
      year: "2025"
    },
    {
      id: 3,
      name: "Medical Supply Distribution",
      impact: "5,000 people received essential healthcare services",
      beneficiaries: "5,000 People",
      location: "Philippines",
      year: "2024"
    },
    {
      id: 4,
      name: "Vocational Training Program",
      impact: "85 youth trained in marketable skills and employed",
      beneficiaries: "85 Youth",
      location: "India",
      year: "2024"
    }
  ];

  return (
    <section className="py-20 px-8 bg-white transition-all duration-700 ease-in-out">
      <div className="max-w-[1400px] mx-auto animate-fade-in">
        <div className="text-center mb-16 animate-[fadeInUp_0.8s_cubic-bezier(0.4,0,0.2,1)]">
          <h2 className="text-4xl font-extrabold text-slate-900 m-0 mb-4">
            Executed Projects & Impact
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed m-0 max-w-3xl mx-auto">
            Proven results from our completed campaigns - every project verified and documented
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {executedProjects.map((project, index) => (
            <div 
              key={project.id}
              style={{ '--card-index': index }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-8 transition-all duration-300 ease-in-out flex flex-col gap-4 relative overflow-hidden animate-card-slide-in [animation-delay:calc(var(--card-index)*0.1s)] hover:-translate-y-1 hover:shadow-lg hover:border-teal-300"
            >
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold text-slate-800 m-0 leading-snug flex-1">
                  {project.name}
                </h3>
                <span className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap shadow-sm transition-all duration-200">
                  {project.year}
                </span>
              </div>
              
              <p className="text-base text-slate-600 leading-relaxed m-0">
                {project.impact}
              </p>
              
              <div className="flex gap-6 mt-2">
                <div className="flex items-center gap-2 text-sm text-teal-primary font-semibold transition-all duration-300 relative before:content-[''] before:absolute before:-bottom-0.5 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-teal-primary before:to-teal-secondary before:transition-all before:duration-400 hover:before:w-full hover:translate-x-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{project.beneficiaries}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-teal-primary font-semibold transition-all duration-300 relative before:content-[''] before:absolute before:-bottom-0.5 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-teal-primary before:to-teal-secondary before:transition-all before:duration-400 hover:before:w-full hover:translate-x-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="9" r="2.5" stroke="#14b8a6" strokeWidth="2"/>
                  </svg>
                  <span>{project.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
