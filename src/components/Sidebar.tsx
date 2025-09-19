import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  Truck, 
  Store, 
  ShoppingCart, 
  Sprout,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { path: '/profile', label: 'Profile', icon: User },
    ];

    if (!user) return baseItems;

    const roleItems = {
      farmer: [
        { path: '/farmer', label: 'Dashboard', icon: Sprout },
        ...baseItems,
      ],
      transporter: [
        { path: '/transporter', label: 'Dashboard', icon: Truck },
        ...baseItems,
      ],
      retailer: [
        { path: '/retailer', label: 'Dashboard', icon: Store },
        ...baseItems,
      ],
      consumer: [
        { path: '/consumer', label: 'Dashboard', icon: ShoppingCart },
        ...baseItems,
      ],
    };

    return roleItems[user.role] || baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] bg-card border-r border-border/50 transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
          isCollapsed ? "-translate-x-full lg:w-16" : "w-64 translate-x-0"
        )}
      >
        {/* Toggle Button */}
        <div className="flex h-14 items-center justify-between border-b border-border/30 px-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 p-4">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-105",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-soft"
                )}
                onClick={() => setIsCollapsed(true)} // Close on mobile after navigation
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-border/30 p-4">
            <div className="rounded-xl bg-gradient-fresh p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Powered by Blockchain
              </p>
              <p className="text-xs font-semibold text-primary">
                Transparent • Secure • Traceable
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-50 lg:hidden shadow-strong"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
};