import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SongFormField from "./form/SongFormField";
import { useSongForm } from "./form/useSongForm";

const SongForm = () => {
  const { formData, updateField, handleSubmit, isSubmitting } = useSongForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <SongFormField
          id="title"
          label="Title"
          value={formData.title}
          onChange={(value) => updateField("title", value)}
          required
        />
        <SongFormField
          id="artist"
          label="Artist"
          value={formData.artist}
          onChange={(value) => updateField("artist", value)}
          required
        />
        <SongFormField
          id="album"
          label="Album"
          value={formData.album}
          onChange={(value) => updateField("album", value)}
        />
        <SongFormField
          id="genre"
          label="Genre"
          value={formData.genre}
          onChange={(value) => updateField("genre", value)}
        />
        <SongFormField
          id="year"
          label="Year"
          value={formData.year}
          onChange={(value) => updateField("year", value)}
          type="number"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <Plus className="mr-2 h-4 w-4" />
        {isSubmitting ? "Adding Song..." : "Add Song"}
      </Button>
    </form>
  );
};

export default SongForm;