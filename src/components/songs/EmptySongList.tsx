import { Music } from "lucide-react";

const EmptySongList = () => {
  return (
    <div className="text-center py-12">
      <Music className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No songs found</h3>
      <p className="text-gray-500">
        Try adjusting your search or check back later for new additions
      </p>
    </div>
  );
};

export default EmptySongList;