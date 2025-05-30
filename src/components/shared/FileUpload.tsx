import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import FilePreview from "./upload/FilePreview";
import UploadProgress from "./upload/UploadProgress";
import { validateFile, uploadFile } from "./upload/uploadUtils";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  bucket?: "event-images" | "blog-images";
  existingUrl?: string;
}

const FileUpload = ({ 
  onUploadComplete, 
  bucket = "event-images",
  existingUrl 
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) {
        toast({
          title: "Error",
          description: "Please select a file to upload",
          variant: "destructive",
        });
        return;
      }

      if (!validateFile(file)) return;

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      const publicUrl = await uploadFile(file, bucket, setProgress);
      
      onUploadComplete(publicUrl);
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete('');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <FilePreview 
          previewUrl={preview}
          onRemove={handleRemove}
        />
      ) : (
        <div className="space-y-4">
          <Input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            accept="image/*"
            className="cursor-pointer"
          />
          {uploading && (
            <UploadProgress value={progress} />
          )}
          <Button disabled={uploading} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;