export interface GeoVisitor {
  id: string;
  name: string;
  visitors: number;
}

export async function fetchVisitorsByGeography(): Promise<GeoVisitor[]> {
  return [
    { id: 'USA', name: 'United States', visitors: 120000 },
    { id: 'CA', name: 'Canada', visitors: 35000 },
    { id: 'GB', name: 'United Kingdom', visitors: 67000 },
    { id: 'DE', name: 'Germany', visitors: 45000 },
    { id: 'FR', name: 'France', visitors: 38000 },
    { id: 'DK', name: 'Denmark', visitors: 18000 },
    { id: 'SE', name: 'Sweden', visitors: 22000 },
  ];
} 