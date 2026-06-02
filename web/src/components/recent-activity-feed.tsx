"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Star, MapPin } from 'lucide-react'
import { cn } from "@/lib/utils"
import { buttonVariants } from './ui/button-variants'
import { Button } from './ui/button'

interface RecentActivityFeedProps {
  initialData: any[]
}

export function RecentActivityFeed({ initialData }: RecentActivityFeedProps) {
  const params = useParams()
  const country = (params?.country as string) || 'cy'
  const [institutes, setInstitutes] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const fetchNearby = async (lat: number, lng: number) => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
      const res = await fetch(`${apiUrl}/institutes/recent?lat=${lat}&lng=${lng}`)
      if (res.ok) {
        const data = await res.json()
        setInstitutes(data)
      }
    } catch (err) {
      console.error("Failed to fetch nearby institutes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchNearby(latitude, longitude)
        setIsLocating(false)
      },
      (error) => {
        console.error("Location error:", error)
        setLocationError("Δεν ήταν δυνατή η πρόσβαση στην τοποθεσία σας.")
        setIsLocating(false)
      }
    )
  }

  // Optional: Auto-request on mount if not already asked
  // But for privacy, a button is often better. Let's do a subtle prompt.

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-2 border-b-2 border-red-50">
        <h2 className="text-[24px] font-extrabold text-[#d32323] pr-4 inline-block">
          {locationError || loading ? 'Φροντιστήρια κοντά σας' : 'Πρόσφατα Φροντιστήρια'}
        </h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLocationRequest}
          disabled={isLocating || loading}
          className="mt-4 sm:mt-0 rounded-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
        >
          <MapPin className={cn("h-4 w-4 mr-2", isLocating && "animate-pulse")} />
          {isLocating ? 'Εντοπισμός...' : 'Κοντά μου'}
        </Button>
      </div>

      {locationError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
          {locationError}
        </div>
      )}

      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-300", loading ? "opacity-50" : "opacity-100")}>
        {institutes.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 py-10 italic">Δεν βρέθηκαν φροντιστήρια στην περιοχή σας.</div>
        ) : (
          institutes.map((inst: any) => (
            <div key={inst.id} className="group border border-gray-100 rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1">
              {/* Institute Image */}
              <div className="h-48 w-full bg-slate-50 overflow-hidden relative border-b border-gray-100">
                <img 
                  src={inst.images?.[0]?.url || inst.logoUrl || "/images/placeholder-institute.webp"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={inst.name} 
                />
                <div className="absolute top-3 right-3">
                  <div className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Νέα Καταχώρηση</p>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-1 text-xs font-bold text-red-600/70 uppercase tracking-widest">
                   {inst.branches?.[0]?.city?.name || 'Κύπρος'}
                </div>
                
                <Link href={`/${country}/institute/${inst.id}`} className="font-black text-xl text-slate-900 hover:text-red-600 transition-colors leading-tight mb-2">
                  {inst.name}
                </Link>
                
                {/* Rating Section */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-[2px]">
                    {[1, 2, 3, 4, 5].map(star => (
                      <div key={star} className={cn(
                        "rounded-[4px] p-0.5 shadow-sm",
                        star <= Math.round(inst.avgRating || 0) ? "bg-[#f15c00]" : "bg-gray-100"
                      )}>
                        <Star className={cn(
                          "h-3 w-3",
                          star <= Math.round(inst.avgRating || 0) ? "fill-white stroke-none" : "fill-gray-300 stroke-none"
                        )} />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {inst.avgRating > 0 ? inst.avgRating.toFixed(1) : 'Νέο'}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    ({inst.reviewCount} Κριτικές)
                  </span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                  {inst.description || 'Καλώς ήρθατε στο φροντιστήριό μας. Προσφέρουμε ποιοτική εκπαίδευση με έμφαση στην επιτυχία των μαθητών μας.'}
                </p>

                <Link 
                  href={`/${country}/institute/${inst.id}`} 
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full rounded-xl border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 mt-auto shadow-sm transition-all"
                  )}
                >
                  Προβολή Προφίλ
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
