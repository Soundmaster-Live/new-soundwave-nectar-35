import { Music, Handshake, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DJFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  topic: string;
}

export const djFeatures: DJFeature[] = [
  {
    icon: Music,
    title: "Sound Expert",
    description: "Professional audio engineering",
    topic: "our professional sound engineering services and equipment"
  },
  {
    icon: Star,
    title: "5-Star Service",
    description: "Consistently rated excellent",
    topic: "our five-star service and customer satisfaction"
  },
  {
    icon: Handshake,
    title: "Client Focus",
    description: "Personalized event solutions",
    topic: "our personalized event solutions and client focus"
  }
];