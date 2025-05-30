import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className={cn("h-6 w-6 animate-spin text-primary", className)} />
    </div>
  );
};

export default LoadingSpinner;