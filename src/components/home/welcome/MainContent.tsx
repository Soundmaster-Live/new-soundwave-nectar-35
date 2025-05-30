import HeaderSection from "./HeaderSection";
import Description from "./Description";
import DJMessageEnhanced from "./DJMessageEnhanced";
import FeaturesGrid from "./FeaturesGrid";
import ConsultationButton from "./ConsultationButton";
import { DJFeature } from "@/utils/features/djFeatures";

interface MainContentProps {
  currentMessage: string;
  isLoading: boolean;
  isProcessing: boolean;
  features: DJFeature[];
  activeFeature: string | null;
  onFeatureClick: (topic: string) => void;
}

const MainContent = ({
  currentMessage,
  isLoading,
  isProcessing,
  features,
  activeFeature,
  onFeatureClick
}: MainContentProps) => {
  return (
    <div className="space-y-6">
      <HeaderSection />
      
      <DJMessageEnhanced 
        message={currentMessage || ""} 
        isLoading={isLoading}
        isProcessing={isProcessing}
      />

      <Description />
      
      <FeaturesGrid 
        features={features}
        activeFeature={activeFeature}
        onFeatureClick={onFeatureClick}
      />
      
      <ConsultationButton />
    </div>
  );
};

export default MainContent;