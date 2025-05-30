import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileImageProps {
  imageUrl: string;
  onClick: () => void;
}

const ProfileImage = ({ imageUrl, onClick }: ProfileImageProps) => {
  return (
    <motion.div 
      className="relative z-10 rounded-2xl overflow-hidden shadow-xl"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="aspect-w-4 aspect-h-5">
        <img
          src={imageUrl}
          alt="Professional sound equipment"
          className="w-full h-full object-cover"
        />
      </div>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <motion.div 
            className="flex items-center gap-4 mb-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={onClick}
          >
            <img
              src="/lovable-uploads/fb8dd939-8a3d-444e-ac29-8f9d0e54268d.png"
              alt="Professional Sound Equipment"
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h3 className="text-2xl font-bold">Professional Equipment</h3>
              <p className="text-gray-200">Top-tier sound systems</p>
            </div>
          </motion.div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-current text-yellow-400" />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileImage;