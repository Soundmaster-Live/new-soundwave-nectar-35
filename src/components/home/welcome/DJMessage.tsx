import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DJMessageProps {
  message: string;
  isLoading: boolean;
}

const DJMessage = ({ message, isLoading }: DJMessageProps) => {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg relative animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="hover:text-primary transition-colors"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        <span className="font-semibold text-primary">Live: DJ John</span>
      </div>
      <p className="text-gray-700 italic">
        {isLoading ? "Loading..." : message}
      </p>
    </div>
  );
};

export default DJMessage;