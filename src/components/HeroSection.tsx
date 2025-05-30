
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LiveStreamPlayer } from "@/components/streaming/player/LiveStreamPlayer";
import { User } from "@/types/user";
import { ArrowRight, Music, Radio, Calendar } from 'lucide-react';

interface HeroSectionProps {
  user?: User | null;
  onSearch?: (query: string) => void;
}

const HeroSection = ({ user, onSearch }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-black text-white py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-800/30 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main content */}
          <div className="text-left space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full text-primary border border-primary/20 mb-4">
              <span className="text-sm font-medium">Experience Soundmaster Live</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Enjoy the <span className="text-primary">Sounds of Limpopo</span> Live
            </h1>
            
            <p className="text-lg text-gray-300 max-w-xl">
              Come and enjoy the sounds of Limpopo and request what you want to listen to. Soundmaster Live brings professional audio excellence to every streaming experience.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 flex items-center gap-2 text-white"
                onClick={() => navigate('/music')}
              >
                <Music className="h-5 w-5" />
                Explore Music
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white flex items-center gap-2"
                onClick={() => navigate('/live-radio')}
              >
                <Radio className="h-5 w-5" />
                Live Radio
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-8">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold">10+</span>
                </div>
                <p className="text-sm text-gray-300">Years of<br/>Experience</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold">500+</span>
                </div>
                <p className="text-sm text-gray-300">Events<br/>Completed</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400 font-bold">24/7</span>
                </div>
                <p className="text-sm text-gray-300">Live Radio<br/>Streaming</p>
              </div>
            </div>
          </div>
          
          {/* Media content */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-600/50 rounded-xl blur-xl opacity-30 animate-pulse"></div>
            <Card className="bg-black/40 backdrop-blur-sm border-white/10 shadow-2xl overflow-hidden rounded-xl">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <LiveStreamPlayer />
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <Radio className="h-5 w-5 text-white" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></span>
                    </div>
                    <div>
                      <p className="font-semibold">Live Radio</p>
                      <p className="text-xs text-gray-400">Always streaming great music</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-300 hover:text-white"
                    onClick={() => navigate('/live-radio')}
                  >
                    Full Experience
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
