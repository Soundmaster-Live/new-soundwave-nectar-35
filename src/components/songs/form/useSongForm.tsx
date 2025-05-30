import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SongFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  year: string;
  is_karaoke: boolean;
}

const initialFormState: SongFormData = {
  title: "",
  artist: "",
  album: "",
  genre: "",
  year: "",
  is_karaoke: true,
};

export const useSongForm = () => {
  const [formData, setFormData] = useState<SongFormData>(initialFormState);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addSongMutation = useMutation({
    mutationFn: async (song: SongFormData) => {
      const { data, error } = await supabase.from("songs").insert({
        ...song,
        year: song.year ? parseInt(song.year) : null,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast({
        title: "Success",
        description: "Song added successfully",
      });
      setFormData(initialFormState);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add song: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateField = (field: keyof SongFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSongMutation.mutate(formData);
  };

  return {
    formData,
    updateField,
    handleSubmit,
    isSubmitting: addSongMutation.isPending,
  };
};