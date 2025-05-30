import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import UserManagement from "@/components/admin/UserManagement";
import LiveLessonSettings from "@/components/admin/LiveLessonSettings";
import DesignCustomizer from "@/components/design/DesignCustomizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate('/auth');
    } else if (profile && !profile.is_admin) {
      navigate('/');
    }
  }, [session, profile, navigate]);

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <div className="container py-8">
      <AdminHeader />
      <Tabs defaultValue="users" className="mt-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="lessons">Live Lessons</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="lessons">
          <LiveLessonSettings />
        </TabsContent>
        <TabsContent value="design">
          <DesignCustomizer />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Admin;