"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Star, MapPin, Search, Filter, X, Navigation, LocateFixed } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

interface Metadata {
  cities: { id: string; name: string }[]
  services: { id: string; name: string }[]
}

interface SearchSidebarProps {
  className?: string;
}

export function SearchSidebar({ className }: SearchSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  
  // Local state synced with URL
  const [filters, setFilters] = useState({
    cityId: searchParams.get("cityId") || "",
    serviceId: searchParams.get("serviceId") || "",
    minRating: searchParams.get("minRating") || "",
    query: searchParams.get("query") || "",
    radius: searchParams.get("radius") || "10",
    lat: searchParams.get("lat") || "",
    lng: searchParams.get("lng") || "",
  })

  // Sync state with URL changes (e.g. browser back/forward)
  useEffect(() => {
    setFilters({
      cityId: searchParams.get("cityId") || "",
      serviceId: searchParams.get("serviceId") || "",
      minRating: searchParams.get("minRating") || "",
      query: searchParams.get("query") || "",
      radius: searchParams.get("radius") || "10",
      lat: searchParams.get("lat") || "",
      lng: searchParams.get("lng") || "",
    })
  }, [searchParams])

  // Automatic location on mount
  useEffect(() => {
    const hasCoords = searchParams.has('lat') && searchParams.has('lng');
    const isFirstLoad = !sessionStorage.getItem('has_auto_located');

    if (!hasCoords && isFirstLoad) {
      handleGetLocation();
      sessionStorage.setItem('has_auto_located', 'true');
    }
  }, []);

  // Fetch metadata once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
        const res = await fetch(`${apiUrl}/institutes/metadata/lists`)
        if (res.ok) {
          setMetadata(await res.json())
        }
      } catch (err) {
        console.error("Failed to fetch search metadata:", err)
      }
    }
    fetchMetadata()
  }, [])

  // Push updates to URL
  const pushFilters = useCallback((newFilters: any) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value as string)
    })
    router.push(`/search?${params.toString()}`)
  }, [router])

  const handleUpdate = (updates: Partial<typeof filters>, debounce = false) => {
    const next = { ...filters, ...updates }
    setFilters(next)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (debounce) {
      debounceTimer.current = setTimeout(() => pushFilters(next), 400)
    } else {
      pushFilters(next)
    }
  }

  const handleGetLocation = () => {
    setLoadingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleUpdate({ 
            lat: pos.coords.latitude.toString(), 
            lng: pos.coords.longitude.toString() 
          })
          setLoadingLocation(false)
        },
        (err) => {
          console.error("Location error:", err)
          setLoadingLocation(false)
          alert("Δεν ήταν δυνατή η πρόσβαση στην τοποθεσία σας.")
        }
      )
    }
  }

  const clearFilters = () => {
    const reset = { 
      cityId: "", 
      serviceId: "", 
      minRating: "", 
      query: "", 
      radius: "10", 
      lat: "", 
      lng: "" 
    }
    setFilters(reset)
    router.push("/search")
  }

  return (
    <div className={cn("bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-28 space-y-8", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Filter className="h-4 w-4" /> Φίλτρα
        </h2>
        <button onClick={clearFilters} className="text-xs font-bold text-red-600 hover:underline">Καθαρισμός</button>
      </div>

      {/* Name Search */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Αναζήτηση</label>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          <input 
            type="text"
            value={filters.query}
            onChange={(e) => handleUpdate({ query: e.target.value }, true)}
            placeholder="Όνομα φροντιστηρίου..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Geolocation Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Απόσταση</label>
        {!filters.lat ? (
          <Button 
            onClick={handleGetLocation}
            variant="outline"
            disabled={loadingLocation}
            className="w-full justify-start gap-3 h-11 border-dashed text-slate-600 hover:text-red-600 hover:border-red-200 transition-all font-bold"
          >
            <LocateFixed className={cn("h-4 w-4", loadingLocation && "animate-spin")} />
            {loadingLocation ? "Εντοπισμός..." : "Κοντά σε μένα"}
          </Button>
        ) : (
          <div className="space-y-4">
             <div className="flex items-center justify-between text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg">
                <span className="flex items-center gap-1.5"><LocateFixed className="h-3 w-3" /> Τοποθεσία Ενεργή</span>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={handleGetLocation} 
                     title="Ανανέωση τοποθεσίας"
                     className="hover:rotate-180 transition-transform duration-500"
                   >
                     <Navigation className={cn("h-3 w-3", loadingLocation && "animate-spin")} />
                   </button>
                   <button onClick={() => handleUpdate({ lat: "", lng: "" })} className="hover:scale-110"><X className="h-3 w-3" /></button>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                    <span>Ακτίνα</span>
                    <span className="text-slate-900">{filters.radius}km</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={filters.radius}
                    onChange={(e) => handleUpdate({ radius: e.target.value }, true)}
                    className="w-full accent-red-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
             </div>
          </div>
        )}
      </div>

      {/* City Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Πόλη</label>
        <select 
          value={filters.cityId}
          onChange={(e) => handleUpdate({ cityId: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium"
        >
          <option value="">Όλες οι πόλεις</option>
          {metadata?.cities.map(city => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
      </div>

      {/* Subject Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Μάθημα / Υπηρεσία</label>
        <select 
          value={filters.serviceId}
          onChange={(e) => handleUpdate({ serviceId: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium"
        >
          <option value="">Όλα τα μαθήματα</option>
          {metadata?.services.map(service => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Αξιολόγηση</label>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="rating" 
                checked={filters.minRating === String(rating)}
                onChange={() => handleUpdate({ minRating: String(rating) })}
                className="hidden"
              />
              <div className={cn(
                "w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all",
                filters.minRating === String(rating) ? "border-red-600 bg-red-600" : "group-hover:border-gray-400"
              )}>
                {filters.minRating === String(rating) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <div className="flex gap-[2px]">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={cn("h-3 w-3", star <= rating ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200")} />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700">{rating}+ Αστέρια</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
