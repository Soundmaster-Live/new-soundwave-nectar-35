
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";

interface StreamHeaderProps {
  title: string;
  isStreamOnline: boolean;
  southAfricanTime: string;
}

const StreamHeader = ({ title, isStreamOnline, southAfricanTime }: StreamHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Radio className="h-7 w-7 text-rose-500" />
          {isStreamOnline && (
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500">
              <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-50 animate-pulse" />
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold">{title}</h1>
        {isStreamOnline && (
          <Badge variant="success" className="ml-2">
            <div className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
            ON AIR
          </Badge>
        )}
      </div>
    </div>
  );
};

export default StreamHeader;
