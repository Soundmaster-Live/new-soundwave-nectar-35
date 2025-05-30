
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import FileUpload from "./shared/FileUpload";
import { useQueryClient } from "@tanstack/react-query";

const BlogPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("blog_posts")
        .insert({
          title,
          content,
          image_url: imageUrl,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });

      // Reset form
      setTitle("");
      setContent("");
      setImageUrl("");
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Create Blog Post</h2>
        
        <div className="space-y-2">
          <Input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <Textarea
            placeholder="Post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="min-h-[200px]"
          />
          
          <FileUpload
            onUploadComplete={setImageUrl}
            bucket="blog-images"
            existingUrl={imageUrl}
          />
        </div>
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
};

export default BlogPostForm;
