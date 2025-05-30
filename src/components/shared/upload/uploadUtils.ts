import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const validateFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    toast({
      title: "Error",
      description: "Please upload an image file",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export const uploadFile = async (
  file: File, 
  bucket: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${Math.random()}.${fileExt}`;

  // Simulate progress
  const progressInterval = setInterval(() => {
    onProgress(Math.min(90, Math.random() * 100));
  }, 100);

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    clearInterval(progressInterval);
    onProgress(100);

    return publicUrl;
  } catch (error) {
    clearInterval(progressInterval);
    throw error;
  }
};