// Who We Are section - mission and values

const AboutSection = () => {
  return (
    <section className="py-20 px-8 bg-gradient-to-b from-white to-slate-50/50 transition-all duration-700 ease-in-out">
      <div className="max-w-[1000px] mx-auto animate-fade-in">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 m-0 mb-10 animate-fade-in-scale">
            Who We Are
          </h2>
          
          <div className="flex flex-col gap-6 animate-fade-in-scale [animation-delay:0.2s] [animation-fill-mode:backwards]">
            <p className="text-lg leading-loose text-slate-600 m-0 text-left">
              DonorLens is revolutionizing charitable giving through complete transparency 
              and accountability. We believe that every donor deserves to see exactly where 
              their contribution goes and the real-world impact it creates.
            </p>
            
            <p className="text-lg leading-loose text-slate-600 m-0 text-left">
              Our platform connects generous donors with verified NGOs and community projects, 
              providing end-to-end tracking of every donation. From the moment you contribute 
              to the final impact report, you'll have complete visibility into how your 
              generosity transforms lives.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
              <div 
                style={{ '--card-index': 0 }}
                className="group bg-white rounded-xl text-center shadow-sm transition-all duration-300 ease-in-out relative overflow-hidden animate-card-float [animation-delay:calc(var(--card-index)*0.15s)] [animation-fill-mode:backwards] border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-teal-200 p-8"
              >
                <div className="flex justify-center mb-4 transition-transform duration-300 group-hover:animate-icon-pulse">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 m-0 mb-3 transition-colors duration-200 group-hover:text-teal-600">
                  Transparency
                </h3>
                <p className="text-[0.95rem] text-slate-500 leading-relaxed m-0 text-center transition-colors duration-300 group-hover:text-slate-600">
                  Every transaction tracked and verified with complete visibility
                </p>
              </div>

              <div 
                style={{ '--card-index': 1 }}
                className="group bg-white rounded-xl text-center shadow-sm transition-all duration-300 ease-in-out relative overflow-hidden animate-card-float [animation-delay:calc(var(--card-index)*0.15s)] [animation-fill-mode:backwards] border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-teal-200 p-8"
              >
                <div className="flex justify-center mb-4 transition-transform duration-300 group-hover:animate-icon-pulse">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 m-0 mb-3 transition-colors duration-200 group-hover:text-teal-600">
                  Trust
                </h3>
                <p className="text-[0.95rem] text-slate-500 leading-relaxed m-0 text-center transition-colors duration-300 group-hover:text-slate-600">
                  Verified NGOs and projects with proven track records
                </p>
              </div>

              <div 
                style={{ '--card-index': 2 }}
                className="group bg-white rounded-xl text-center shadow-sm transition-all duration-300 ease-in-out relative overflow-hidden animate-card-float [animation-delay:calc(var(--card-index)*0.15s)] [animation-fill-mode:backwards] border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-teal-200 p-8"
              >
                <div className="flex justify-center mb-4 transition-transform duration-300 group-hover:animate-icon-pulse">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 m-0 mb-3 transition-colors duration-200 group-hover:text-teal-600">
                  Impact
                </h3>
                <p className="text-[0.95rem] text-slate-500 leading-relaxed m-0 text-center transition-colors duration-300 group-hover:text-slate-600">
                  Measurable results and real stories from communities we serve
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-slate-600 text-center font-medium mt-8 p-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 transition-all duration-200 animate-fade-in-scale [animation-delay:0.6s] [animation-fill-mode:backwards] hover:border-teal-300 hover:shadow-md">
              Partner with us in building a more transparent, accountable future for charitable 
              giving. Together, we can ensure that every act of kindness reaches those who need 
              it most and creates lasting positive change.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
