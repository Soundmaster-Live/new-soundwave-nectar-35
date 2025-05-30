
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Show } from "@/types/show";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Pencil, Trash } from "lucide-react";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ScheduleManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Show | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schedules, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radio_shows")
        .select("*")
        .order("day", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data as Show[];
    },
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (newSchedule: Omit<Show, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("radio_shows")
        .insert([newSchedule])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Schedule created successfully",
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

  const updateScheduleMutation = useMutation({
    mutationFn: async (schedule: Show) => {
      const { data, error } = await supabase
        .from("radio_shows")
        .update(schedule)
        .eq("id", schedule.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setIsDialogOpen(false);
      setEditingSchedule(null);
      toast({
        title: "Success",
        description: "Schedule updated successfully",
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

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("radio_shows")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
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
    const scheduleData: Omit<Show, "id" | "created_at" | "updated_at"> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      dj: formData.get("dj") as string,
      day: parseInt(formData.get("day") as string),
      start_time: formData.get("start_time") as string,
      end_time: formData.get("end_time") as string,
      genre: formData.get("genre") as string,
      is_recurring: formData.get("is_recurring") === "true",
    };

    if (editingSchedule) {
      updateScheduleMutation.mutate({ ...editingSchedule, ...scheduleData });
    } else {
      createScheduleMutation.mutate(scheduleData);
    }
  };

  if (isLoadingSchedules) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Show Schedule</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSchedule(null)}>
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? "Edit Schedule" : "Create New Schedule"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingSchedule?.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingSchedule?.description || ""}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dj">DJ</label>
                <Input
                  id="dj"
                  name="dj"
                  defaultValue={editingSchedule?.dj}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="day">Day of Week</label>
                <Select
                  name="day"
                  defaultValue={editingSchedule?.day?.toString()}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="start_time">Start Time</label>
                <Input
                  type="time"
                  id="start_time"
                  name="start_time"
                  defaultValue={editingSchedule?.start_time}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end_time">End Time</label>
                <Input
                  type="time"
                  id="end_time"
                  name="end_time"
                  defaultValue={editingSchedule?.end_time}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="genre">Genre</label>
                <Input
                  id="genre"
                  name="genre"
                  defaultValue={editingSchedule?.genre || ""}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_recurring"
                  name="is_recurring"
                  defaultChecked={editingSchedule?.is_recurring ?? true}
                />
                <label htmlFor="is_recurring">Recurring Schedule</label>
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
                  {editingSchedule ? "Update" : "Create"}
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
              <TableHead>Day</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>DJ</TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules?.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.title}</TableCell>
                <TableCell>{DAYS_OF_WEEK[schedule.day]}</TableCell>
                <TableCell>{schedule.start_time}</TableCell>
                <TableCell>{schedule.end_time}</TableCell>
                <TableCell>{schedule.dj}</TableCell>
                <TableCell>{schedule.is_recurring ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingSchedule(schedule);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteScheduleMutation.mutate(schedule.id)}
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

export default ScheduleManagement;
