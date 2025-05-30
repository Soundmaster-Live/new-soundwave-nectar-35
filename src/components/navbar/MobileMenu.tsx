
import { MobileNavItem } from "./MobileNavItem";
import { MobileUserMenu } from "./MobileUserMenu";
import { AuthButtons } from "./AuthButtons";
import { LiveRadioButton } from "./LiveRadioButton";
import { User as UserType } from "@/types/user";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  authRequired?: boolean;
  children?: {
    name: string;
    path: string;
    icon?: React.ReactNode;
    description?: string;
  }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  user: any;
  isLoading: boolean;
  openDropdown: string | null;
  setOpenDropdown: (name: string | null) => void;
  handleSignOut: () => Promise<void>;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileMenu = ({ 
  isOpen, 
  navItems, 
  user, 
  isLoading, 
  openDropdown, 
  setOpenDropdown,
  handleSignOut,
  setIsOpen
}: MobileMenuProps) => {
  const handleItemClick = () => setIsOpen(false);

  return (
    <div className={`md:hidden absolute w-full bg-background border-b border-border transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
      <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
        {navItems.map((item) => (
          <MobileNavItem 
            key={item.name}
            item={item}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            onItemClick={handleItemClick}
          />
        ))}
        
        <div className="pt-4 space-y-2">
          {!isLoading && !user ? (
            <AuthButtons isMobile onItemClick={handleItemClick} />
          ) : !isLoading && user ? (
            <MobileUserMenu 
              user={user} 
              onSignOut={handleSignOut} 
              onItemClick={handleItemClick} 
            />
          ) : null}
          
          <LiveRadioButton isMobile onItemClick={handleItemClick} />
        </div>
      </div>
    </div>
  );
};
