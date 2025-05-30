import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateCSS } from "@/utils/styleGenerator";
import type { DesignPreferences, DesignField } from "@/types/design";

const defaultPreferences: DesignPreferences = {
  primaryColor: "#FF4F1F",
  backgroundColor: "#ffffff",
  fontFamily: "Inter, sans-serif",
  buttonStyle: "rounded",
  layout: "single-column",
  fontSize: "16px",
  spacing: "1rem",
  animations: true,
};

export default function DesignCustomizer() {
  const [preferences, setPreferences] = useState<DesignPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'design_preferences')
        .single();

      if (settings?.value) {
        setPreferences(JSON.parse(settings.value));
        applyStyles(JSON.parse(settings.value));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleChange = (field: DesignField, value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyStyles = (prefs: DesignPreferences) => {
    const generatedCSS = generateCSS(prefs);
    const styleId = 'custom-theme';
    let styleSheet = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      document.head.appendChild(styleSheet);
    }

    styleSheet.textContent = generatedCSS;
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'design_preferences',
          value: JSON.stringify(preferences),
        });

      if (error) throw error;

      applyStyles(preferences);
      toast({
        title: "Success",
        description: "Design preferences saved successfully",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save design preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Customize Design</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input
              id="primaryColor"
              type="color"
              value={preferences.primaryColor}
              onChange={(e) => handleChange("primaryColor", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <Input
              id="backgroundColor"
              type="color"
              value={preferences.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select
              value={preferences.fontFamily}
              onValueChange={(value) => handleChange("fontFamily", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                <SelectItem value="Georgia, serif">Georgia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonStyle">Button Style</Label>
            <Select
              value={preferences.buttonStyle}
              onValueChange={(value: "rounded" | "sharp") => handleChange("buttonStyle", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select button style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="sharp">Sharp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="layout">Layout</Label>
            <Select
              value={preferences.layout}
              onValueChange={(value: "single-column" | "multi-column") => handleChange("layout", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-column">Single Column</SelectItem>
                <SelectItem value="multi-column">Multi Column</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Input
              id="fontSize"
              type="text"
              value={preferences.fontSize}
              onChange={(e) => handleChange("fontSize", e.target.value)}
              placeholder="e.g., 16px"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spacing">Spacing</Label>
            <Input
              id="spacing"
              type="text"
              value={preferences.spacing}
              onChange={(e) => handleChange("spacing", e.target.value)}
              placeholder="e.g., 1rem"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="animations">Enable Animations</Label>
            <Switch
              id="animations"
              checked={preferences.animations}
              onCheckedChange={(checked) => handleChange("animations", checked)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              setPreferences(defaultPreferences);
              applyStyles(defaultPreferences);
            }}
          >
            Reset to Default
          </Button>
          <Button onClick={savePreferences} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}