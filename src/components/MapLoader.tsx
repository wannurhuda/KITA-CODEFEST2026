'use client';
import dynamic from 'next/dynamic';
import type { MapItem } from './MapView';

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div className="h-[480px] animate-pulse rounded-2xl bg-brand-100" /> });

export function MapLoader({ items }: { items: MapItem[] }) {
  return <MapView items={items} />;
}
