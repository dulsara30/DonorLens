import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export default function LocationAutocomplete({ value, onSelect, error }) {
  const [query, setQuery] = useState(value?.locationName || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query || query.trim().length < 3) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            query
          )}&limit=5`
        );

        const data = await response.json();
        setResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Location search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (place) => {
    const selected = {
      locationName: place.display_name,
      latitude: Number(place.lat),
      longitude: Number(place.lon),
    };

    setQuery(place.display_name);
    setShowDropdown(false);
    onSelect(selected);
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-semibold text-slate-900">
        Location *
      </label>

      <div className="relative">
        <MapPin
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search location"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSelect({
              locationName: "",
              latitude: null,
              longitude: null,
            });
          }}
          onFocus={() => {
            if (results.length) setShowDropdown(true);
          }}
          className={`w-full rounded-2xl border bg-white py-3.5 pl-11 pr-4 outline-none transition ${
            error
              ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
              : "border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          }`}
        />
      </div>

      {loading && (
        <p className="mt-2 text-sm text-slate-500">Searching location...</p>
      )}

      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

      {showDropdown && results.length > 0 && (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          {results.map((place) => (
            <button
              type="button"
              key={`${place.place_id}-${place.lat}-${place.lon}`}
              onClick={() => handleSelect(place)}
              className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 transition last:border-b-0 hover:bg-slate-50"
            >
              {place.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}