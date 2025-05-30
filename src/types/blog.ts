
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  user_id?: string | null;
  created_at: string;
}
