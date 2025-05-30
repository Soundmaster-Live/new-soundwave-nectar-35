
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const ContactMap = () => {
  // In a real implementation, this would use Mapbox or another map provider
  // For now, we'll create a placeholder that looks like a map
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative h-[300px] w-full bg-gray-100 rounded-b-lg overflow-hidden">
          <div className="w-full h-full" 
               style={{
                 backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/30.147675,-23.833333,14/600x300?access_token=pk.placeholder')",
                 backgroundSize: "cover",
                 backgroundPosition: "center"
               }}>
          </div>
          
          {/* Overlay with pin and information */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-3 rounded-lg shadow-lg flex items-start gap-2 max-w-[80%]">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">SoundMaster Radio</h3>
                <p className="text-sm text-muted-foreground">Tzaneen, Limpopo, South Africa</p>
              </div>
            </div>
          </div>
          
          {/* Information overlay */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-background/80 to-transparent p-4">
            <p className="text-sm">
              To use interactive maps, configure a Mapbox API key in your environment setup.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactMap;
