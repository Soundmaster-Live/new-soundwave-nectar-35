import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { QueryClient } from "@tanstack/react-query";

interface AuthStateManagerProps {
  queryClient: QueryClient;
}

const AuthStateManager = ({ queryClient }: AuthStateManagerProps) => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome back!",
          description: `Signed in as ${session?.user.email}`,
        });
      }
      if (event === "SIGNED_OUT") {
        queryClient.clear();
        toast({
          title: "Signed out",
          description: "Successfully signed out of your account",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return null;
};

export default AuthStateManager;