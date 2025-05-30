import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardEnhancedProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  isActive: boolean;
}

const FeatureCardEnhanced = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  isActive 
}: FeatureCardEnhancedProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border",
        isActive && "ring-2 ring-primary border-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <motion.div 
          className={cn(
            "p-2 rounded-lg",
            isActive ? "bg-primary/20" : "bg-primary/10"
          )}
          animate={{ scale: isActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-6 w-6 text-primary" />
        </motion.div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCardEnhanced;