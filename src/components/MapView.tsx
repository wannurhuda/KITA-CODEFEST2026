
'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export interface MapItem {
  id: string;
  title: string;
  lat: number;
  lng: number;
  urgency: number;
  area: string;
}

export default function MapView({ items }: { items: MapItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import('leaflet').Map | undefined;
    let cancelled = false;

    async function initializeMap() {
      const L = (await import('leaflet')).default;

      if (cancelled || !ref.current) return;

      map = L.map(ref.current).setView([4.3685, 100.9665], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      L.marker([4.3836, 100.9686])
        .addTo(map)
        .bindPopup('<b>Universiti Teknologi PETRONAS</b>');

      items.forEach((i) => {
        const dot = i.urgency >= 3 ? '#d64541' : '#e8a317';

        L.marker([i.lat, i.lng], {
          icon: L.divIcon({
            className: '',
            html: `<div style="width:18px;height:18px;border-radius:50%;background:${dot};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
            iconSize: [18, 18],
          }),
        })
          .addTo(map!)
          .bindPopup(
            `<b>${i.title.replace(/</g, '&lt;')}</b><br>${i.area.replace(/</g, '&lt;')}<br><a href="/needs/${encodeURIComponent(i.id)}">Open</a>`
          );
      });
    }

    initializeMap().catch((error) => {
      if (!cancelled) {
        console.error('Error initializing KITA map:', error);
      }
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [items]);

  return (
    <div
      ref={ref}
      className="h-[480px] w-full rounded-2xl border border-[#e0e7de]"
      role="application"
      aria-label="Map"
    />
  );
}
