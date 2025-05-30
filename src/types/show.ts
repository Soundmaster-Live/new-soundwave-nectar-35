
export interface Show {
  id: string;
  title: string;
  description: string | null;
  dj: string;
  day: number;
  start_time: string;
  end_time: string;
  genre: string | null;
  is_recurring: boolean | null;
  created_at: string;
  updated_at: string;
}
