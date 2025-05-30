
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme/theme-provider";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

import { NavLogo } from "./navbar/NavLogo";
import { DesktopNav } from "./navbar/DesktopNav";
import { DesktopActions } from "./navbar/DesktopActions";
import { MobileMenuToggle } from "./navbar/MobileMenuToggle";
import { MobileMenu } from "./navbar/MobileMenu";
import { useNavItems } from "./navbar/useNavItems";
import useAuth from "../hooks/use-auth.tsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  // Using 'any' type for user to handle type compatibility between Supabase User and our User type
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navItems = useNavItems();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again."
      });
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border fixed w-full z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <NavLogo />
          </div>
          
          <DesktopNav 
            navItems={navItems} 
            openDropdown={openDropdown} 
            setOpenDropdown={setOpenDropdown} 
          />
          
          <DesktopActions isLoading={isLoading} user={user} />

          <div className="md:hidden flex items-center">
            <MobileMenuToggle isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isOpen}
        navItems={navItems}
        user={user}
        isLoading={isLoading}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        handleSignOut={handleSignOut}
        setIsOpen={setIsOpen}
      />
    </nav>
  );
};

export default Navbar;
