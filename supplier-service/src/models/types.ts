export interface Supplier {
  id: string;
  name: string;
  type: string;
  building: string;
  floor: string | null;
  location_description: string | null;
  latitude: number; 
  longitude: number;
  starting_time: string | null; 
  closing_time: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}