
import { Link } from "react-router-dom";
import { Radio } from "lucide-react";

export const NavLogo = () => {
  return (
    <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
      <Radio className="h-6 w-6" />
      <span>Soundmaster</span>
    </Link>
  );
};
