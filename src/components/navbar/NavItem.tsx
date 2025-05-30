
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface NavSubItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface NavItemProps {
  item: {
    name: string;
    path: string;
    icon: React.ReactNode;
    children?: NavSubItem[];
    authRequired?: boolean;
  };
  isActive?: boolean;
  isOpenDropdown?: boolean;
  isChild?: boolean;
  openDropdown: string | null;
  setOpenDropdown: (name: string | null) => void;
}

export const NavItem = ({ 
  item, 
  isActive, 
  isOpenDropdown,
  isChild,
  openDropdown, 
  setOpenDropdown 
}: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // If this is a dropdown item with children
  if (item.children) {
    return (
      <div 
        className="relative group" 
        onMouseEnter={() => setOpenDropdown(item.name)} 
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button
          className={`flex items-center gap-1 hover:text-primary transition-colors duration-200 ${isActive ? 'text-primary' : 'text-foreground'}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span>{item.name}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpenDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {openDropdown === item.name && (
          <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-popover border border-border overflow-hidden z-50">
            <div className="py-2">
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  to={child.path}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors duration-200"
                  onClick={() => setOpenDropdown(null)}
                >
                  <div className="bg-primary/10 rounded-md p-2 text-primary">
                    {child.icon || item.icon}
                  </div>
                  <div>
                    <div className="font-medium">{child.name}</div>
                    {child.description && (
                      <p className="text-xs text-muted-foreground mt-1">{child.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // If this is a child item in a dropdown
  if (isChild) {
    return (
      <Link
        to={item.path}
        className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors duration-200 ${isActive ? 'text-primary' : 'text-foreground'}`}
        onClick={() => setOpenDropdown(null)}
      >
        {item.icon}
        <span>{item.name}</span>
      </Link>
    );
  }
  
  // Regular nav item
  return (
    <Link
      to={item.path}
      className={`flex items-center gap-2 px-2 py-2 hover:text-primary transition-colors duration-200 ${isActive ? 'text-primary' : 'text-foreground'}`}
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  );
};
