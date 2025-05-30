
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type Settings = Database['public']['Tables']['settings']['Insert'];
type StreamPlatform = 'kick' | 'youtube';

interface LiveLessonSettingsProps {
  initialUrl?: string;
}

const LiveLessonSettings = ({ initialUrl = "" }: LiveLessonSettingsProps) => {
  const { toast } = useToast();
  const [iframeUrl, setIframeUrl] = useState<string>(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<StreamPlatform>('kick');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'live_lesson_url')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" - we don't want to show an error for this
          console.error('Error fetching settings:', error);
          return;
        }
        
        if (data?.value) {
          setIframeUrl(data.value);
          
          // Determine platform based on URL
          if (data.value.includes('youtube.com') || data.value.includes('youtu.be')) {
            setPlatform('youtube');
          } else {
            setPlatform('kick');
          }
        } else {
          // Set default URL based on platform
          setIframeUrl("https://player.kick.com/soundmasterlive");
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  const validateUrl = (url: string, streamPlatform: StreamPlatform): boolean => {
    try {
      const parsed = new URL(url);
      
      if (streamPlatform === 'kick') {
        return parsed.protocol === 'https:' && 
          (parsed.hostname.includes('kick.com') || 
           parsed.hostname.includes('player.kick.com'));
      } else if (streamPlatform === 'youtube') {
        return parsed.protocol === 'https:' && 
          (parsed.hostname.includes('youtube.com') || 
           parsed.hostname.includes('youtu.be') ||
           parsed.hostname.includes('youtube-nocookie.com'));
      }
      
      return false;
    } catch (e) {
      return false;
    }
  };

  const handleIframeUpdate = async () => {
    if (!validateUrl(iframeUrl, platform)) {
      if (platform === 'kick') {
        setValidationError("Please enter a valid Kick.com URL (https://player.kick.com/...)");
      } else {
        setValidationError("Please enter a valid YouTube URL (https://www.youtube.com/embed/...)");
      }
      return;
    }
    
    setValidationError(null);
    setIsLoading(true);
    
    try {
      const settingsData: Settings = {
        key: 'live_lesson_url',
        value: iframeUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save platform selection as well
      const platformData: Settings = {
        key: 'live_lesson_platform',
        value: platform,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save both settings in one transaction
      const { error: urlError } = await supabase
        .from('settings')
        .upsert(settingsData, {
          onConflict: 'key',
        });

      if (urlError) throw urlError;

      const { error: platformError } = await supabase
        .from('settings')
        .upsert(platformData, {
          onConflict: 'key',
        });

      if (platformError) throw platformError;

      toast({
        title: "Success",
        description: "Live lesson stream settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating stream settings:', error);
      toast({
        title: "Error",
        description: "Failed to update live lesson settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultUrl = () => {
    if (platform === 'kick') {
      setIframeUrl("https://player.kick.com/soundmasterlive");
    } else {
      setIframeUrl("https://www.youtube.com/embed/live_stream?channel=UCzxRjbRPw2Y8m0PriGX9ylQ");
    }
    setValidationError(null);
    toast({
      title: "Default URL Set",
      description: `Default ${platform === 'kick' ? 'Kick.com' : 'YouTube'} streaming URL has been set. Click Save to apply.`,
    });
  };

  const handlePlatformChange = (newPlatform: StreamPlatform) => {
    setPlatform(newPlatform);
    setIframeUrl(''); // Clear URL when changing platforms
    setValidationError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Stream Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="stream-platform">Streaming Platform</Label>
          <Select 
            value={platform} 
            onValueChange={(value) => handlePlatformChange(value as StreamPlatform)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kick">Kick.com</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="iframe-url">Live Stream URL</Label>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              id="iframe-url"
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              placeholder={platform === 'kick' 
                ? "Enter your Kick.com streaming URL" 
                : "Enter your YouTube streaming URL"}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={getDefaultUrl}>Default</Button>
              <Button onClick={handleIframeUpdate} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {platform === 'kick' 
              ? "Enter a valid Kick.com player URL (e.g., https://player.kick.com/soundmasterlive)" 
              : "Enter a valid YouTube embed URL (e.g., https://www.youtube.com/embed/live_stream?channel=UCzxRjbRPw2Y8m0PriGX9ylQ)"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveLessonSettings;
