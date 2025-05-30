
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Show } from "@/types/show";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Pencil, Trash } from "lucide-react";

const ShowManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: shows, isLoading } = useQuery({
    queryKey: ["shows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radio_shows")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Show[];
    },
  });

  const createShowMutation = useMutation({
    mutationFn: async (newShow: Omit<Show, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("radio_shows")
        .insert([newShow])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Show created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateShowMutation = useMutation({
    mutationFn: async (show: Show) => {
      const { data, error } = await supabase
        .from("radio_shows")
        .update(show)
        .eq("id", show.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      setIsDialogOpen(false);
      setEditingShow(null);
      toast({
        title: "Success",
        description: "Show updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteShowMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("radio_shows")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      toast({
        title: "Success",
        description: "Show deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const showData: Omit<Show, "id" | "created_at" | "updated_at"> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      dj: formData.get("dj") as string,
      day: 0,
      start_time: "00:00",
      end_time: "00:00",
      genre: formData.get("genre") as string,
      is_recurring: false,
    };

    if (editingShow) {
      updateShowMutation.mutate({ ...editingShow, ...showData });
    } else {
      createShowMutation.mutate(showData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Radio Shows</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingShow(null)}>Add Show</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingShow ? "Edit Show" : "Create New Show"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingShow?.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingShow?.description || ""}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dj">DJ</label>
                <Input
                  id="dj"
                  name="dj"
                  defaultValue={editingShow?.dj}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="genre">Genre</label>
                <Input
                  id="genre"
                  name="genre"
                  defaultValue={editingShow?.genre || ""}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingShow ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>DJ</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shows?.map((show) => (
              <TableRow key={show.id}>
                <TableCell>{show.title}</TableCell>
                <TableCell>{show.description}</TableCell>
                <TableCell>{show.dj}</TableCell>
                <TableCell>{show.genre}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingShow(show);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteShowMutation.mutate(show.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShowManagement;
