
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BlogPost from "./BlogPost";
import type { BlogPost as BlogPostType } from "@/types/blog";

const BlogList = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogPostType[];
    },
  });

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts?.map((post) => (
        <BlogPost
          key={post.id}
          title={post.title}
          content={post.content}
          imageUrl={post.image_url}
          createdAt={post.created_at}
        />
      ))}
    </div>
  );
};

export default BlogList;
