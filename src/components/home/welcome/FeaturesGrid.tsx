import { DJFeature } from "@/utils/features/djFeatures";
import FeatureCardEnhanced from "./FeatureCardEnhanced";

interface FeaturesGridProps {
  features: DJFeature[];
  activeFeature: string | null;
  onFeatureClick: (topic: string) => void;
}

const FeaturesGrid = ({ features, activeFeature, onFeatureClick }: FeaturesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {features.map((feature) => (
        <FeatureCardEnhanced
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          onClick={() => onFeatureClick(feature.topic)}
          isActive={activeFeature === feature.title}
        />
      ))}
    </div>
  );
};

export default FeaturesGrid;