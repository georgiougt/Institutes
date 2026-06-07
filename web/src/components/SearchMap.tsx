'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  userLocation?: { lat: number; lng: number };
}

function MapFix({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    // Force recalculation of container size
    setTimeout(() => {
      map.invalidateSize();
      map.setView(center, map.getZoom());
    }, 100);
  }, [center, map]);
  return null;
}

export default function SearchMap({ institutes, userLocation }: SearchMapProps) {
  const params = useParams();
  const country = (params?.country as string) || 'cy';
  // Filter institutes that have branches with coordinates
  const markers = institutes.flatMap(inst => 
    (inst.branches || [])
      .filter((b: any) => b.latitude && b.longitude)
      .map((b: any) => ({
        id: b.id,
        position: [b.latitude, b.longitude] as [number, number],
        name: inst.name,
        instituteId: inst.id,
        instituteSlug: inst.slug,
        address: b.address
      }))
  );

  // Determine map center
  const getCenter = (): [number, number] => {
    if (markers.length > 0) return markers[0].position;
    if (userLocation) return [userLocation.lat, userLocation.lng];
    return [35.1264, 33.3677]; // Default Nicosia
  };

  const center = getCenter();

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })}
          >
            <Popup>
              <div className="p-1 font-bold text-xs">Είσαι εδώ (σύμφωνα με το browser)</div>
            </Popup>
          </Marker>
        )}

        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-sm mb-1">{marker.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{marker.address}</p>
                <Link 
                  href={`/${country}/institute/${marker.instituteSlug || marker.instituteId}`}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Προβολή Προφίλ
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapFix center={center} />
      </MapContainer>
    </div>
  );
}
