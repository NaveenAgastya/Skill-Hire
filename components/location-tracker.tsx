"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { Booking, Tracking } from "@/types/database"
import { MapPin, Navigation, CheckCircle2 } from "lucide-react"

interface LocationTrackerProps {
  booking: Booking
  isLaborer?: boolean
}

// Declare google variable
declare global {
  interface Window {
    google: any
  }
}

export default function LocationTracker({ booking, isLaborer = false }: LocationTrackerProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()
  const [tracking, setTracking] = useState<Tracking | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      return new Promise<void>((resolve) => {
        script.onload = () => resolve()
      })
    }

    const initMap = async () => {
      if (!window.google || !mapRef.current) {
        await loadGoogleMapsScript()
      }

      if (mapRef.current && window.google) {
        // Default to booking location if no tracking data
        const defaultLocation = { lat: 40.7128, lng: -74.006 } // New York as fallback

        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 15,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#7c93a3" }, { lightness: "-10" }],
            },
            {
              featureType: "administrative.country",
              elementType: "geometry",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [{ color: "#a0a4a5" }],
            },
            {
              featureType: "administrative.province",
              elementType: "geometry.stroke",
              stylers: [{ color: "#62838e" }],
            },
            {
              featureType: "landscape",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "landscape.man_made",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "landscape.natural",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "landscape.natural.terrain",
              elementType: "geometry.fill",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi",
              elementType: "geometry.fill",
              stylers: [{ color: "#e2e2e2" }],
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry.fill",
              stylers: [{ color: "#d8e9cd" }],
            },
            {
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#d6d6d6" }],
            },
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#d6d6d6" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.stroke",
              stylers: [{ color: "#d6d6d6" }],
            },
            {
              featureType: "road.arterial",
              elementType: "labels",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "road.local",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road.local",
              elementType: "geometry.stroke",
              stylers: [{ color: "#d6d6d6" }],
            },
            {
              featureType: "road.local",
              elementType: "labels",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "transit.line",
              elementType: "geometry.fill",
              stylers: [{ color: "#d6d6d6" }],
            },
            {
              featureType: "transit.station",
              elementType: "geometry.fill",
              stylers: [{ color: "#808080" }],
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#b1d6de" }],
            },
          ],
        })

        markerRef.current = new window.google.maps.Marker({
          position: defaultLocation,
          map: mapInstanceRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4F46E5",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
        })
      }
    }

    initMap()
  }, [])

  // Fetch tracking data
  useEffect(() => {
    const fetchTracking = async () => {
      const { data, error } = await supabase
        .from("tracking")
        .select("*")
        .eq("booking_id", booking.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error("Error fetching tracking data:", error)
        return
      }

      if (data) {
        setTracking(data)
        updateMapLocation(data.latitude, data.longitude)
      }
    }

    fetchTracking()

    // Subscribe to tracking updates
    const trackingSubscription = supabase
      .channel(`tracking:booking_id=eq.${booking.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tracking",
          filter: `booking_id=eq.${booking.id}`,
        },
        (payload) => {
          const newTracking = payload.new as Tracking
          setTracking(newTracking)
          updateMapLocation(newTracking.latitude, newTracking.longitude)
        },
      )
      .subscribe()

    return () => {
      trackingSubscription.unsubscribe()
    }
  }, [booking.id, supabase])

  // Update map with new location
  const updateMapLocation = (latitude: number, longitude: number) => {
    if (mapInstanceRef.current && markerRef.current && window.google) {
      const position = new window.google.maps.LatLng(latitude, longitude)
      markerRef.current.setPosition(position)
      mapInstanceRef.current.panTo(position)
    }
  }

  // Start tracking location
  const startTracking = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation tracking.",
      })
      return
    }

    setIsTracking(true)

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation({ latitude, longitude })
        updateMapLocation(latitude, longitude)

        // Save initial position to database
        await saveLocationToDatabase(latitude, longitude, "in_progress")
      },
      (error) => {
        console.error("Error getting location:", error)
        toast({
          variant: "destructive",
          title: "Location error",
          description: "Could not get your current location. Please check your device settings.",
        })
        setIsTracking(false)
      },
    )

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation({ latitude, longitude })
        updateMapLocation(latitude, longitude)

        // Save updated position to database
        await saveLocationToDatabase(latitude, longitude, "in_progress")
      },
      (error) => {
        console.error("Error watching location:", error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      },
    )
  }

  // Stop tracking location
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setIsTracking(false)
  }

  // Save location to database
  const saveLocationToDatabase = async (latitude: number, longitude: number, status: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("tracking").upsert({
        booking_id: booking.id,
        laborer_id: booking.laborer_id,
        latitude,
        longitude,
        status,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      // Also update booking status if needed
      if (booking.status !== status && status !== "in_progress") {
        await supabase.from("bookings").update({ status }).eq("id", booking.id)
      }
    } catch (error) {
      console.error("Error saving location:", error)
      toast({
        variant: "destructive",
        title: "Error saving location",
        description: "Could not save your location. Please try again.",
      })
    }
  }

  // Complete job
  const completeJob = async () => {
    if (!currentLocation) return

    try {
      await saveLocationToDatabase(currentLocation.latitude, currentLocation.longitude, "completed")

      stopTracking()

      toast({
        title: "Job completed",
        description: "The job has been marked as completed.",
      })
    } catch (error) {
      console.error("Error completing job:", error)
      toast({
        variant: "destructive",
        title: "Error completing job",
        description: "Could not mark the job as completed. Please try again.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Location Tracker</CardTitle>
            <CardDescription>
              {isLaborer ? "Share your location with the client" : "Track the worker's location"}
            </CardDescription>
          </div>
          <Badge
            variant={
              tracking?.status === "completed"
                ? "default"
                : tracking?.status === "in_progress"
                  ? "secondary"
                  : "outline"
            }
          >
            {tracking?.status ? tracking.status.replace("_", " ") : "Not started"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-[300px] rounded-md overflow-hidden mb-4" />

        {tracking && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>Last updated: {new Date(tracking.updated_at).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center">
              <Navigation className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                Coordinates: {tracking.latitude.toFixed(6)}, {tracking.longitude.toFixed(6)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isLaborer ? (
          <>
            {!isTracking && booking.status !== "completed" && <Button onClick={startTracking}>Start Tracking</Button>}
            {isTracking && (
              <>
                <Button variant="outline" onClick={stopTracking}>
                  Pause Tracking
                </Button>
                <Button onClick={completeJob}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete Job
                </Button>
              </>
            )}
            {booking.status === "completed" && <Button disabled>Job Completed</Button>}
          </>
        ) : (
          <Button variant="outline" className="w-full">
            <MapPin className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
