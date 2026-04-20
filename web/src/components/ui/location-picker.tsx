'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamic import for the Map components to avoid SSR
const MapContainer = dynamic(() => 
  import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false }
);
const TileLayer = dynamic(() => 
  import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false }
);
const Marker = dynamic(() => 
  import('react-leaflet').then((mod) => mod.Marker), { ssr: false }
);

interface LocationPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

// Helper component to handle map centering (must be used inside MapContainer)
// We define it here but we'll only render it when client-side
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const { useMap } = require('react-leaflet');
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Import Leaflet only on the client
    const leaflet = require('leaflet');
    setL(leaflet);
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          onChange(lat, lng);
        }
      },
    }),
    [onChange],
  );

  const customIcon = useMemo(() => {
    if (!L) return null;
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  }, [L]);

  if (!isClient || !L) {
    return (
      <div className="h-[200px] w-full bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-slate-400">
        Loading map...
      </div>
    );
  }

  const position: [number, number] = [lat || 35.1264, lng || 33.3677];

  return (
    <div className="h-[200px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <MapContainer 
        center={position} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          icon={customIcon}
        />
        <ChangeView center={position} zoom={16} />
      </MapContainer>
    </div>
  );
}
