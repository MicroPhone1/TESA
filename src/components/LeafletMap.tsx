"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  center?: [number, number];
  zoom?: number;
  className?: string;
};

export default function LeafletMap({
  center = [13.7563, 100.5018],
  zoom = 12,
  className,
}: Props) {
  return (
    <div className={className ?? ""}>
      <MapContainer {...({ center, zoom } )} className="h-full w-full rounded-xl overflow-hidden">
        <TileLayer
          {...({ attribution: '&copy; OpenStreetMap' } )}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
