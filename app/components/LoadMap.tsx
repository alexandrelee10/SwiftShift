"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type LoadMapProps = {
    className?: string;
};

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function LoadMap({ className = "" }: LoadMapProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        const pickup: [number, number] = [-80.1918, 25.7617]; // Miami
        const current: [number, number] = [-83.2785, 30.8327]; // Valdosta
        const delivery: [number, number] = [-84.388, 33.749]; // Atlanta

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/navigation-day-v1",
            center: [-82.7, 29.8],
            zoom: 5.2,
        });

        const map = mapRef.current;

        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

        map.on("load", () => {
            map.addSource("route", {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: [pickup, current, delivery],
                    },
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
                    "line-color": "#2563eb",
                    "line-width": 4,
                },
            });

            addMarker(map, pickup, "Pickup", "Miami, FL", "green");
            addMarker(map, current, "Current", "Valdosta, GA", "blue");
            addMarker(map, delivery, "Delivery", "Atlanta, GA", "red");
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div
            ref={mapContainer}
            className={`h-full w-full ${className}`}
        />

    );
}

function addMarker(
    map: mapboxgl.Map,
    coordinates: [number, number],
    title: string,
    subtitle: string,
    color: "green" | "blue" | "red"
) {
    const colors = {
        green: "#16a34a",
        blue: "#2563eb",
        red: "#ef4444",
    };

    const marker = document.createElement("div");
    marker.className =
        "flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-md";
    marker.style.backgroundColor = colors[color];

    new mapboxgl.Marker(marker)
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 20 }).setHTML(`
        <div style="font-size: 13px;">
          <strong>${title}</strong>
          <p style="margin: 4px 0 0; color: #52525b;">${subtitle}</p>
        </div>
      `)
        )
        .addTo(map);
}