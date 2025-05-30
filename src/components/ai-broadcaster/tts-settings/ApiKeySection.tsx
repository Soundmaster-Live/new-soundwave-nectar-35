
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ApiKeySectionProps {
  apiKey: string;
  setApiKey: (value: string) => void;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({ 
  apiKey, 
  setApiKey 
}) => {
  const [visible, setVisible] = useState(false);
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="api-key">ElevenLabs API Key</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="api-key"
            type={visible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your ElevenLabs API key"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setVisible(!visible)}
            type="button"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        <a 
          href="https://beta.elevenlabs.io/subscription" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Get your ElevenLabs API key
        </a>
      </p>
    </div>
  );
};

export default ApiKeySection;
