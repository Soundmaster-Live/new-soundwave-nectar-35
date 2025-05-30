import { Music } from "lucide-react";

const HeaderSection = () => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-primary/10 rounded-full">
        <Music className="h-6 w-6 text-primary" />
      </div>
      <h2 className="text-4xl font-bold leading-tight">
        Meet <span className="text-primary">John Morden</span>
      </h2>
    </div>
  );
};

export default HeaderSection;