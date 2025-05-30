
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from "lucide-react";

interface AuthRequiredProps {
  onClose: () => void;
}

const AuthRequired: React.FC<AuthRequiredProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/auth');
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="bg-muted rounded-full p-4">
        <LockKeyhole className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h3 className="font-medium mb-2">Authentication Required</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please log in to configure voice settings and enable the AI DJ's speech capabilities.
        </p>
        <Button onClick={handleLogin}>Go to Login</Button>
      </div>
    </div>
  );
};

export default AuthRequired;
