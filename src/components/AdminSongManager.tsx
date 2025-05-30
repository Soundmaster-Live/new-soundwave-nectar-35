import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SongForm from "./songs/SongForm";
import SongList from "./songs/SongList";

const AdminSongManager = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Song</CardTitle>
          <CardDescription>Add a new song to the catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <SongForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Song Catalog</CardTitle>
          <CardDescription>Manage existing songs</CardDescription>
        </CardHeader>
        <CardContent>
          <SongList />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSongManager;