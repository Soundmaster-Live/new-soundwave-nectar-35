
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NavItem } from "./NavItem";
import useAuth from "../../hooks/use-auth.tsx";

interface DesktopNavProps {
  navItems: any[];
  openDropdown: string | null;
  setOpenDropdown: (value: string | null) => void;
}

export const DesktopNav = ({ navItems, openDropdown, setOpenDropdown }: DesktopNavProps) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-1">
      {navItems.map((item) => {
        // Skip items that require authentication if user is not logged in
        if (item.authRequired && !user) {
          return null;
        }
        
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);

        const isOpenDropdown = openDropdown === item.name;

        return (
          <div key={item.name} className="relative px-2" 
               style={{ position: 'relative', zIndex: isOpenDropdown ? 50 : 'auto' }}>
            <NavItem
              item={item}
              isActive={isActive}
              isOpenDropdown={isOpenDropdown}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />
          </div>
        );
      })}
    </div>
  );
};
