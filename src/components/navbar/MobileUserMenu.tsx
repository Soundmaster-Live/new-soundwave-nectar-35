
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "@/types/user";

interface MobileUserMenuProps {
  user: any; // Using 'any' to handle compatibility between Supabase User and our User type
  onSignOut: () => Promise<void>;
  onItemClick: () => void;
}

export const MobileUserMenu = ({ user, onSignOut, onItemClick }: MobileUserMenuProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-2 border-t border-border">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar_url || ""} alt={user.username || user.email || "User"} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{user.username || user.email?.split('@')[0]}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>
      
      <div className="space-y-1 pt-2">
        <Link
          to="/profile"
          className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
          onClick={onItemClick}
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
          onClick={onItemClick}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
          onClick={onItemClick}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
        {user.is_admin && (
          <Link
            to="/admin"
            className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
            onClick={onItemClick}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Admin</span>
          </Link>
        )}
        <button
          onClick={() => {
            onSignOut();
            onItemClick();
          }}
          className="flex items-center gap-2 w-full text-left py-2 text-foreground hover:text-primary"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};
