import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShowManagement from "./shows/ShowManagement";
import ScheduleManagement from "./schedule/ScheduleManagement";
import PlaylistManagement from "./playlists/PlaylistManagement";
import { useAdmin } from "@/contexts/AdminContext";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Radio Station Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shows">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shows">Shows</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
            </TabsList>
            <TabsContent value="shows">
              <ShowManagement />
            </TabsContent>
            <TabsContent value="schedule">
              <ScheduleManagement />
            </TabsContent>
            <TabsContent value="playlists">
              <PlaylistManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;