export interface DesignPreferences {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  buttonStyle: "rounded" | "sharp";
  layout: "single-column" | "multi-column";
  fontSize: string;
  spacing: string;
  animations: boolean;
}

export type DesignField = keyof DesignPreferences;