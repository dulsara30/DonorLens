import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Every Donation Creates Real Change",
    description:
      "Support meaningful community projects and help bring hope to people who need it most.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 2,
    title: "Together We Can Build Stronger Communities",
    description:
      "From education to clean water, every campaign can transform lives with the right support.",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 3,
    title: "Small Acts of Kindness Have Big Impact",
    description:
      "Track your campaigns, manage progress, and inspire more people to contribute toward good causes.",
    image:
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function DashboardCharitySlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[activeIndex];

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="relative h-[360px] w-full sm:h-[420px]">
        <img
          src={activeSlide.image}
          alt={activeSlide.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/35 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 py-8 sm:px-10 sm:py-10">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              Welcome to your foundation dashboard
            </span>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              {activeSlide.title}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
              {activeSlide.description}
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}