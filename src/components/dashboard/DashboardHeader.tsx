
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  // Get first letter of username for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.username || "User"}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your account</p>
      </div>
      
      <Card className="p-0 shadow-sm border-muted">
        <CardContent className="p-3 flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar_url || ""} alt={user.username || "User"} />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.username || "User"}</p>
            <p className="text-sm text-muted-foreground">{user.email || ""}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHeader;
