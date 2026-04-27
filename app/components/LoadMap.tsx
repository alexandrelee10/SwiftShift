"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Matches the shape returned by /api/loads/[id]
type LoadData = {
  id: string;
  referenceNumber: string;
  originAddress: string;
  originCity: string;
  originState: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  status: string;
  distanceMiles: number | null;
};

type Coords = [number, number]; // [lng, lat]

type LoadMapProps = {
  loadId: string;
  className?: string;
};

async function geocodeAddress(address: string): Promise<Coords | null> {
  const encoded = encodeURIComponent(address);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${token}&country=US&limit=1`,
  );
  if (!res.ok) return null;
  const data = await res.json();
  const feature = data.features?.[0];
  if (!feature) return null;
  return feature.center as Coords; // [lng, lat]
}

async function fetchRoadRoute(
  origin: Coords,
  destination: Coords,
): Promise<GeoJSON.LineString | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const coords = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
  const res = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${token}`,
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.routes?.[0]?.geometry ?? null;
}

export default function LoadMap({ loadId, className = "" }: LoadMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [load, setLoad] = useState<LoadData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch load from API
  useEffect(() => {
    if (!loadId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/loads/${loadId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch load (${r.status})`);
        return r.json();
      })
      .then((data: LoadData) => setLoad(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [loadId]);

  // 2. Initialise map + plot route once load is ready
  useEffect(() => {
    if (!load || !mapContainer.current) return;
    // Clean up any previous map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/navigation-day-v1",
      center: [-95, 37],
      zoom: 3.5,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.on("load", async () => {
      const originFull = `${load.originCity}, ${load.originState}`; // Add precise addresses later on 
      const destFull = `${load.destinationCity}, ${load.destinationState}`; // Add precise addresses later

      const [originCoords, destCoords] = await Promise.all([
        geocodeAddress(originFull),
        geocodeAddress(destFull),
      ]);

      if (!originCoords || !destCoords) {
        setError("Could not geocode one or more addresses.");
        return;
      }

      const routeGeometry = await fetchRoadRoute(originCoords, destCoords);

      if (!routeGeometry) {
        setError("Could not fetch road route.");
        return;
      }

      // Draw the route line
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: routeGeometry,
        },
      });

      // Subtle casing / glow layer
      map.addLayer({
        id: "route-casing",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#93c5fd",
          "line-width": 8,
          "line-opacity": 0.4,
        },
      });

      // Main route line
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#2563eb",
          "line-width": 4,
        },
      });

      // Markers
      addMarker(
        map,
        originCoords,
        "Pickup",
        `${load.originCity}, ${load.originState}`,
        load.originAddress,
        "green",
      );
      addMarker(
        map,
        destCoords,
        "Delivery",
        `${load.destinationCity}, ${load.destinationState}`,
        load.destinationAddress,
        "red",
      );

      // Fit map to route bounds
      const allCoords: Coords[] =
        routeGeometry.type === "LineString"
          ? (routeGeometry.coordinates as Coords[])
          : [];

      if (allCoords.length > 0) {
        const bounds = allCoords.reduce(
          (b, c) => b.extend(c),
          new mapboxgl.LngLatBounds(allCoords[0], allCoords[0]),
        );
        map.fitBounds(bounds, { padding: 60, maxZoom: 12 });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [load]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-100 text-zinc-500 text-sm ${className}`}
      >
        Loading map…
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-red-50 text-red-500 text-sm ${className}`}
      >
        {error}
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />

      {/* Ref badge overlay */}
      {load && (
        <div className="absolute top-3 left-3 z-10 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2 shadow text-xs text-zinc-700 font-medium">
          <span className="text-zinc-400 mr-1">REF</span>
          {load.referenceNumber}
          <span
            className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusColors[load.status] ?? "bg-zinc-100 text-zinc-600"}`}
          >
            {load.status.replace("_", " ")}
          </span>
        </div>
      )}
    </div>
  );
}

const statusColors: Record<string, string> = {
  POSTED: "bg-blue-100 text-blue-700",
  BOOKED: "bg-yellow-100 text-yellow-700",
  IN_TRANSIT: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function addMarker(
  map: mapboxgl.Map,
  coordinates: Coords,
  title: string,
  cityState: string,
  address: string,
  color: "green" | "red",
) {
  const colors = { green: "#16a34a", red: "#ef4444" };

  const el = document.createElement("div");
  el.className =
    "flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-md cursor-pointer";
  el.style.backgroundColor = colors[color];

  new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 20 }).setHTML(`
        <div style="font-size:13px;line-height:1.4;">
          <strong>${title}</strong>
          <p style="margin:2px 0 0;font-weight:600;">${cityState}</p>
          <p style="margin:2px 0 0;color:#52525b;">${address}</p>
        </div>
      `),
    )
    .addTo(map);
}
