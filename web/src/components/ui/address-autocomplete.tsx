'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { Input } from './input';
import { Loader2, Search } from 'lucide-react';

const libraries: ("places")[] = ["places"];

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({ 
  onAddressSelect, 
  defaultValue = "", 
  placeholder = "Αναζητήστε διεύθυνση ή όνομα φροντιστηρίου...",
  className
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      
      const address = place.formatted_address || place.name || "";
      const lat = place.geometry?.location?.lat() || 0;
      const lng = place.geometry?.location?.lng() || 0;

      if (address) {
        setInputValue(address);
        onAddressSelect(address, lat, lng);
      }
    }
  };

  if (loadError) {
    return <p className="text-xs text-red-500 font-bold">Error loading Google Maps</p>;
  }

  if (!isLoaded) {
    return (
      <div className="relative">
        <Input disabled className={className} placeholder="Loading maps..." />
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "cy" }, // Restrict to Cyprus since the app context seems to be Greece/Cyprus
          fields: ["address_components", "geometry", "icon", "name", "formatted_address"],
        }}
      >
        <div className="relative">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className={`${className} pl-10`}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </Autocomplete>
    </div>
  );
}
