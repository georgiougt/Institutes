'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SearchMapProps {
  institutes: any[];
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function SearchMap({ institutes }: SearchMapProps) {
  // Filter institutes that have branches with coordinates
  const markers = institutes.flatMap(inst => 
    (inst.branches || [])
      .filter((b: any) => b.latitude && b.longitude)
      .map((b: any) => ({
        id: b.id,
        position: [b.latitude, b.longitude] as [number, number],
        name: inst.name,
        instituteId: inst.id,
        address: b.address
      }))
  );

  // Default center to the first marker or Nicosia/Limassol area
  const defaultCenter: [number, number] = markers.length > 0 
    ? markers[0].position 
    : [35.1264, 33.3677];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-sm mb-1">{marker.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{marker.address}</p>
                <Link 
                  href={`/institute/${marker.instituteId}`}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        {markers.length > 0 && <ChangeView center={markers[0].position} />}
      </MapContainer>
    </div>
  );
}
