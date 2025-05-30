
import { Clock, HomeIcon, Info, MessageSquare, Radio, LayoutDashboard, Music, Heart, Star } from "lucide-react";

export const useNavItems = () => {
  return [
    {
      name: "Home",
      path: "/",
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      name: "About",
      path: "/about",
      icon: <Info className="h-4 w-4" />,
    },
    {
      name: "Services",
      path: "/services",
      icon: <Clock className="h-4 w-4" />,
      children: [
        {
          name: "Party Sound",
          path: "/services/party-sound",
          icon: <Music className="h-4 w-4" />,
          description: "Professional sound systems for parties and events"
        },
        {
          name: "Karaoke Sound",
          path: "/services/karaoke-sound",
          icon: <Star className="h-4 w-4" />,
          description: "Complete karaoke setup for entertaining events"
        },
        {
          name: "Wedding Sound",
          path: "/services/wedding-sound",
          icon: <Heart className="h-4 w-4" />,
          description: "Make your special day perfect with our sound services"
        },
      ],
    },
    {
      name: "Live Radio",
      path: "/live-radio",
      icon: <Radio className="h-4 w-4" />,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      authRequired: true,
    },
  ];
};
