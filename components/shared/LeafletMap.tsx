"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/utils";
import type { Agency, Bike } from "@/types";

// Fix Leaflet default marker icons broken by webpack
function fixLeafletIcons() {
  // @ts-expect-error leaflet type gap
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const brandIcon = (count: number) =>
  L.divIcon({
    className: "",
    html: `<div style="
      background:#E85D24;
      color:#fff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      width:32px;height:32px;
      display:flex;align-items:center;justify-content:center;
      font-weight:800;font-size:11px;
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,.5);
    "><span style="transform:rotate(45deg)">${count}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });

export interface MapPin {
  agency: Agency;
  bikes: Bike[];
  lat: number;
  lng: number;
}

interface Props {
  pins: MapPin[];
  center?: [number, number];
  zoom?: number;
}

export function LeafletMap({ pins, center = [12.8797, 121.774], zoom = 6 }: Props) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-xl"
      style={{ background: "#1a1a1a" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((pin) => (
        <Marker
          key={pin.agency.id}
          position={[pin.lat, pin.lng]}
          icon={brandIcon(pin.bikes.length)}
        >
          <Popup>
            <div style={{ minWidth: 180, fontFamily: "inherit" }}>
              <p style={{ fontWeight: 800, marginBottom: 4 }}>{pin.agency.name}</p>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{pin.agency.city}</p>
              <p style={{ fontSize: 12, marginBottom: 6 }}>
                {pin.bikes.length} bike{pin.bikes.length !== 1 ? "s" : ""} available
              </p>
              {pin.bikes.slice(0, 3).map((b) => (
                <div key={b.id} style={{ fontSize: 11, display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span>{b.brand} {b.model}</span>
                  <strong>{formatPrice(b.daily_rate)}/d</strong>
                </div>
              ))}
              {pin.bikes.length > 3 && (
                <p style={{ fontSize: 11, color: "#888" }}>+{pin.bikes.length - 3} more</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
