export interface ServerLocation {
  id: string;
  name: string;
  exchange: string;
  cloudProvider: 'AWS' | 'GCP' | 'Azure' | 'Other';
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  latency: number; // in ms
}

export interface CloudRegion {
  id: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  name: string;
  code: string;
  latitude: number;
  longitude: number;
}

export interface GeoData {
  servers: ServerLocation[];
  regions: CloudRegion[];
}