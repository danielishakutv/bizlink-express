import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Home, Menu, Settings, ShoppingCart, Users, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const isRootPath = location.pathname === "/" || location.pathname === "/dashboard";
  const isStorePath = location.pathname.startsWith('/store');

  const navigationItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Menu", icon: Menu, path: "/menu" },
    { label: "Orders", icon: ShoppingCart, path: "/orders" },
    ...(isMobile ? [] : [{ label: "Team", icon: Users, path: "/team" }]),
    { label: "Customize", icon: Settings, path: "/customize" },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate('/login');
    }
  };

  // Don't render the layout for store pages
  if (isStorePath) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation for Desktop */}
      {!isMobile && (
        <div className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              {!isRootPath && (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2",
                    location.pathname === item.path && "bg-secondary"
                  )}
                  onClick={() => handleNavigate(item.path)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
            <Button variant="ghost" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1",
        !isMobile && "mt-16", // Add top margin for desktop to account for fixed header
        isMobile && "mb-16"   // Add bottom margin for mobile to account for bottom nav
      )}>
        {!isRootPath && isMobile && (
          <div className="p-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        )}
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t z-50">
          <div className="grid grid-cols-5 h-full w-full">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "h-full rounded-none flex flex-col items-center justify-center gap-1 w-full",
                  location.pathname === item.path && "bg-secondary"
                )}
                onClick={() => handleNavigate(item.path)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};