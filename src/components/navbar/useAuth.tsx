
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as UserType } from "@/types/user";

export const useAuth = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || undefined,
              username: profile.username,
              is_admin: profile.is_admin || false,
              created_at: profile.created_at,
              avatar_url: profile.avatar_url || session.user.user_metadata?.avatar_url
            });
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || undefined,
              username: profile.username,
              is_admin: profile.is_admin || false,
              created_at: profile.created_at,
              avatar_url: profile.avatar_url || session.user.user_metadata?.avatar_url
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
