
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthButtonsProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const AuthButtons = ({ isMobile = false, onItemClick }: AuthButtonsProps) => {
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <div className="space-y-2">
        <Button
          onClick={() => {
            navigate('/auth');
            onItemClick?.();
          }}
          className="w-full flex items-center gap-2 justify-center"
        >
          <LogIn className="h-4 w-4" />
          Login
        </Button>
        
        <Button
          onClick={() => {
            navigate('/auth?tab=signup');
            onItemClick?.();
          }}
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
        >
          <UserPlus className="h-4 w-4" />
          Register
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => navigate('/auth')}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5"
      >
        <LogIn className="h-3.5 w-3.5" />
        Login
      </Button>
      
      <Button
        onClick={() => navigate('/auth?tab=signup')}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5"
      >
        <UserPlus className="h-3.5 w-3.5" />
        Register
      </Button>
    </>
  );
};
