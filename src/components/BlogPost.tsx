import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface BlogPostProps {
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

const BlogPost = ({ title, content, imageUrl, createdAt }: BlogPostProps) => {
  return (
    <Card className="overflow-hidden">
      {imageUrl && (
        <div className="relative h-48">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-500">
          {format(new Date(createdAt), "MMMM dd, yyyy")}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{content}</p>
      </CardContent>
    </Card>
  );
};

export default BlogPost;