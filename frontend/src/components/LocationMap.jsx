import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// Fix Leaflet marker icons when using Vite

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],

  shadowSize: [41, 41],
});


// Handles map clicks

function MapClickHandler({ onLocationSelect }) {

  useMapEvents({

    click(event) {

      const { lat, lng } = event.latlng;

      onLocationSelect(lat, lng);

    },

  });

  return null;
}


function LocationMap({
  latitude,
  longitude,
  onLocationSelect,
}) {

  const position = [
    latitude,
    longitude,
  ];


  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">

      <MapContainer
        center={position}
        zoom={11}
        scrollWheelZoom={true}
        style={{
          height: "420px",
          width: "100%",
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <MapClickHandler
          onLocationSelect={onLocationSelect}
        />


        <Marker
          position={position}
          icon={markerIcon}
        />

      </MapContainer>

    </div>
  );
}


export default LocationMap;