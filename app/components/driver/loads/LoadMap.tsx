"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

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

type Coords = [number, number];

type LoadMapProps = {
  loadId?: string;
  className?: string;
};

async function geocodeAddress(address: string): Promise<Coords | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;

  const encoded = encodeURIComponent(address);

  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${token}&country=US&limit=1`
  );

  if (!res.ok) return null;

  const data = await res.json();
  const feature = data.features?.[0];

  if (!feature) return null;

  return feature.center as Coords;
}

async function fetchRoadRoute(
  origin: Coords,
  destination: Coords
): Promise<GeoJSON.LineString | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;

  const coords = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;

  const res = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${token}`
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
  const [loading, setLoading] = useState(Boolean(loadId));

  useEffect(() => {
    if (!loadId) {
      setLoading(false);
      setLoad(null);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(`/api/loads/${loadId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch load (${r.status})`);
        return r.json();
      })
      .then((data: LoadData) => {
        if (!cancelled) setLoad(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadId]);

  useEffect(() => {
    if (!load || !mapContainer.current) return;

    let cancelled = false;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [-95, 37],
      zoom: 3.5,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.on("load", async () => {
      try {
        if (cancelled || !mapRef.current) return;

        const originFull = `${load.originCity}, ${load.originState}`;
        const destFull = `${load.destinationCity}, ${load.destinationState}`;

        const [originCoords, destCoords] = await Promise.all([
          geocodeAddress(originFull),
          geocodeAddress(destFull),
        ]);

        if (cancelled || !mapRef.current) return;

        if (!originCoords || !destCoords) {
          setError("Could not geocode one or more addresses.");
          return;
        }

        const routeGeometry = await fetchRoadRoute(originCoords, destCoords);

        if (cancelled || !mapRef.current) return;

        if (!routeGeometry) {
          setError("Could not fetch road route.");
          return;
        }

        if (!map.isStyleLoaded()) return;

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: routeGeometry,
          },
        });

        map.addLayer({
          id: "route-shadow",
          type: "line",
          source: "route",
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#0f172a",
            "line-width": 13,
            "line-opacity": 0.75,
            "line-blur": 1.5,
          },
        });

        map.addLayer({
          id: "route-glow",
          type: "line",
          source: "route",
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#38bdf8",
            "line-width": 9,
            "line-opacity": 0.45,
            "line-blur": 2,
          },
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 5,
            "line-opacity": 1,
          },
        });

        map.addLayer({
          id: "route-highlight",
          type: "line",
          source: "route",
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#93c5fd",
            "line-width": 2,
            "line-opacity": 0.9,
          },
        });

        addMarker(
          mapRef.current,
          originCoords,
          "Pickup",
          `${load.originCity}, ${load.originState}`,
          load.originAddress,
          "green"
        );

        addMarker(
          mapRef.current,
          destCoords,
          "Delivery",
          `${load.destinationCity}, ${load.destinationState}`,
          load.destinationAddress,
          "red"
        );

        const allCoords = routeGeometry.coordinates as Coords[];

        if (allCoords.length > 0) {
          const bounds = allCoords.reduce(
            (b, c) => b.extend(c),
            new mapboxgl.LngLatBounds(allCoords[0], allCoords[0])
          );

          map.fitBounds(bounds, {
            padding: 70,
            maxZoom: 12,
          });
        }
      } catch {
        if (!cancelled) setError("Map failed to load.");
      }
    });

    return () => {
      cancelled = true;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [load]);

  if (!loadId) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-sm text-slate-500 ${className}`}
      >
        No load selected
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-sm text-slate-500 ${className}`}
      >
        Loading map...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-red-900/50 bg-red-950/30 text-sm text-red-400 ${className}`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl ${className}`}
    >
      <div ref={mapContainer} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10" />

      {load && (
        <div className="absolute left-4 top-4 z-10 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs font-medium text-slate-300 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">REF</span>

            <span className="font-semibold text-white">
              {load.referenceNumber}
            </span>

            <span
              className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                statusColors[load.status] ?? "bg-slate-800 text-slate-300"
              }`}
            >
              {load.status.replace("_", " ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const statusColors: Record<string, string> = {
  POSTED: "bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/30",
  BOOKED: "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400/30",
  IN_TRANSIT: "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/30",
  DELIVERED: "bg-green-500/20 text-green-200 ring-1 ring-green-400/30",
  CANCELLED: "bg-red-500/20 text-red-200 ring-1 ring-red-400/30",
};

function addMarker(
  map: mapboxgl.Map | null,
  coordinates: Coords,
  title: string,
  cityState: string,
  address: string,
  color: "green" | "red"
) {
  if (!map) return;

  const colors = {
    green: {
      bg: "#22c55e",
      ring: "#86efac",
    },
    red: {
      bg: "#ef4444",
      ring: "#fca5a5",
    },
  };

  const el = document.createElement("div");

  el.className =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 shadow-xl";

  el.style.backgroundColor = colors[color].bg;
  el.style.borderColor = colors[color].ring;
  el.style.boxShadow = `0 0 0 6px ${colors[color].bg}33, 0 20px 40px rgba(0,0,0,0.35)`;

  new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({
        offset: 24,
        className: "swiftshift-popup",
      }).setHTML(`
        <div style="
          font-size:13px;
          line-height:1.5;
          padding:4px;
          color:#e2e8f0;
          min-width:160px;
        ">
          <strong style="font-size:14px;color:white;">
            ${title}
          </strong>

          <p style="
            margin:4px 0 0;
            font-weight:600;
            color:#f8fafc;
          ">
            ${cityState}
          </p>

          <p style="
            margin:4px 0 0;
            color:#94a3b8;
          ">
            ${address || "No address listed"}
          </p>
        </div>
      `)
    )
    .addTo(map);
}