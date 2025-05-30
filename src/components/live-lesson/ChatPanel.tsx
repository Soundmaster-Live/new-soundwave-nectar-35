
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatPanelProps {
  chatUrl: string;
  platform: 'kick' | 'youtube';
  onClose?: () => void;
}

const ChatPanel = ({ chatUrl, platform, onClose }: ChatPanelProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'live' | 'ai'>('live');

  return (
    <Card className="w-full md:w-80 lg:w-96 max-h-[800px] flex flex-col h-[600px] shadow-md">
      <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center">
          <CardTitle className="text-base font-medium flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            {platform === 'kick' ? 'Kick.com' : 'YouTube'} 
          </CardTitle>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'live' | 'ai')} className="ml-4">
            <TabsList className="h-8">
              <TabsTrigger value="live" className="text-xs px-2 py-1">Live Chat</TabsTrigger>
              <TabsTrigger value="ai" className="text-xs px-2 py-1">AI Assistant</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => window.open(chatUrl, '_blank')}
            title="Open in new window"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative">
        <TabsContent value="live" className="h-full m-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <LoadingSpinner />
            </div>
          )}
          <iframe
            src={chatUrl}
            className="w-full h-full border-0"
            frameBorder="0"
            onLoad={() => setIsLoading(false)}
          />
        </TabsContent>
        <TabsContent value="ai" className="h-full m-0 p-2">
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">
              Need help with the stream? Ask our AI assistant in the chat bubble at the bottom right corner.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4" 
              onClick={() => document.querySelector('.fixed.bottom-4.right-4 button')?.dispatchEvent(new MouseEvent('click'))}
            >
              Open AI Assistant
            </Button>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default ChatPanel;
