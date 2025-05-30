
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface MobileNavItemProps {
  item: {
    name: string;
    path: string;
    icon: React.ReactNode;
    children?: {
      name: string;
      path: string;
      icon?: React.ReactNode;
      description?: string;
    }[];
  };
  openDropdown: string | null;
  setOpenDropdown: (name: string | null) => void;
  onItemClick: () => void;
}

export const MobileNavItem = ({ 
  item, 
  openDropdown, 
  setOpenDropdown, 
  onItemClick 
}: MobileNavItemProps) => {
  const navigate = useNavigate();
  
  if (item.children) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between py-2">
          <button
            onClick={() => navigate(item.path)}
            className="flex items-center gap-2 text-foreground hover:text-primary"
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
          <button 
            onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
            className="p-1 hover:bg-muted rounded"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className={`space-y-1 pl-6 border-l-2 border-border ml-4 overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          {item.children.map((child) => (
            <Link
              key={child.name}
              to={child.path}
              className="flex items-center gap-2 py-2 text-sm text-foreground hover:text-primary"
              onClick={onItemClick}
            >
              {child.icon}
              <span>{child.name}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <Link
      to={item.path}
      className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
      onClick={onItemClick}
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  );
};
