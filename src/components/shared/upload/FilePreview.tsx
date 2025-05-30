import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilePreviewProps {
  previewUrl: string;
  onRemove: () => void;
}

const FilePreview = ({ previewUrl, onRemove }: FilePreviewProps) => {
  return (
    <div className="relative">
      <img 
        src={previewUrl} 
        alt="Preview" 
        className="w-full h-48 object-cover rounded-lg"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FilePreview;