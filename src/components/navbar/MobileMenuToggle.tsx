
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileMenuToggle = ({ isOpen, setIsOpen }: MobileMenuToggleProps) => {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="text-foreground hover:text-primary p-2"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};
