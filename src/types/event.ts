
export interface Event {
  id: string;
  title: string;
  date: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  created_at: string | null;
  created_by: string | null;
}
