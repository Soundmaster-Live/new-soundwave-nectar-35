
import React from 'react';
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";

interface ErrorAlertProps {
  error: string | null;
  onRetry: () => void;
}

const ErrorAlert = ({ error, onRetry }: ErrorAlertProps) => {
  const { isAdmin } = useAdmin();
  
  if (!error || !isAdmin) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Stream Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onRetry}
          className="ml-2"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
