
export interface Booking {
  id: string;
  user_id: string | null;
  event_type: string;
  event_date: string;
  time: string;
  details: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}
