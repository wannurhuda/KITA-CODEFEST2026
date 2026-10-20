// General areas only (not exact addresses) to protect privacy. Coordinates are approximate.
export interface Area { id: string; name: string; lat: number; lng: number }

export const AREAS: Area[] = [
  { id: 'utp', name: 'Universiti Teknologi PETRONAS (UTP)', lat: 4.3836, lng: 100.9686 },
  { id: 'seri-iskandar', name: 'Bandar Seri Iskandar', lat: 4.3685, lng: 100.9665 },
  { id: 'kg-seri-iskandar', name: 'Kampung Seri Iskandar', lat: 4.36, lng: 100.975 },
  { id: 'bota', name: 'Bota', lat: 4.35, lng: 100.95 },
  { id: 'tronoh', name: 'Tronoh', lat: 4.39, lng: 100.995 },
  { id: 'batu-gajah', name: 'Batu Gajah', lat: 4.4709, lng: 101.0425 },
  { id: 'ipoh', name: 'Ipoh', lat: 4.5975, lng: 101.0901 }
];

export function getArea(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}
