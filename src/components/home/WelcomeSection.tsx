
import { useState } from "react";
import { useAIMessageQueue } from "./welcome/AIMessageQueue";
import MainContent from "./welcome/MainContent";
import ProfileImage from "./welcome/ProfileImage";
import { generateAIResponse, processAIResponse } from "@/utils/ai/aiUtils";
import { djFeatures } from "@/utils/features/djFeatures";
import { toast } from "@/components/ui/use-toast";

const WelcomeSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const { addToQueue, isProcessing, currentMessage } = useAIMessageQueue();

  const handleFeatureClick = async (topic: string) => {
    try {
      setIsLoading(true);
      console.log("Generating AI response for:", topic);
      
      const aiResponse = await generateAIResponse(topic);
      const processedResponse = await processAIResponse(aiResponse);
      
      // Now the processedResponse is a string, not a Promise
      addToQueue(processedResponse);

      // Show relevant toasts based on response type
      if (aiResponse.type === 'song') {
        toast({
          title: "Songs Found! 🎵",
          description: "Check out these matching songs from our collection.",
        });
      } else if (aiResponse.type === 'booking') {
        toast({
          title: "Ready to Book? 📅",
          description: "Click to schedule your appointment now!",
        });
      }
    } catch (error) {
      console.error('Error handling feature click:', error);
      
      // Add a fallback message to the queue so the UI doesn't hang
      addToQueue(`Hey there! I'd love to tell you about ${topic}, but I'm having a technical hiccup. Check back in a moment! 🎧`);
      
      toast({
        title: "Connection Issue",
        description: "Our DJ is experiencing technical difficulties. Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <MainContent 
            currentMessage={currentMessage}
            isLoading={isLoading}
            isProcessing={isProcessing}
            features={djFeatures}
            activeFeature={activeFeature}
            onFeatureClick={(topic) => {
              setActiveFeature(topic);
              handleFeatureClick(topic);
            }}
          />
          
          <ProfileImage 
            imageUrl="https://images.unsplash.com/photo-1470225620780-dba8ba36b745"
            onClick={() => handleFeatureClick("our professional sound equipment and top-tier systems")}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
