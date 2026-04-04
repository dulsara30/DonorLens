import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      try {
        // Reverse geocoding using OpenStreetMap (Nominatim)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();

        const locationData = {
          locationName: data.display_name,
          latitude: lat,
          longitude: lng,
        };

        onSelect(locationData);
      } catch (error) {
        console.error("Reverse geocoding error:", error);

        onSelect({
          locationName: `${lat}, ${lng}`,
          latitude: lat,
          longitude: lng,
        });
      }
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function MapPicker({ onSelect, error, value }) {
  const defaultPosition = [6.9271, 79.8612]; // Colombo

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-900">
        Location *
      </label>

      <div
        className={`overflow-hidden rounded-2xl border ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      >
        <MapContainer
          center={defaultPosition}
          zoom={7}
          style={{ height: "350px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker onSelect={onSelect} />
        </MapContainer>
      </div>

      {value?.locationName && (
        <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm">
          <p className="font-semibold">Selected Location:</p>
          <p>{value.locationName}</p>
          {/* <p className="text-slate-500">
            Lat: {value.latitude} | Lng: {value.longitude}
          </p> */}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}