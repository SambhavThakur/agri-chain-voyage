import { LogOut, Leaf, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer':
        return 'text-success';
      case 'transporter':
        return 'text-warning';
      case 'retailer':
        return 'text-primary';
      case 'consumer':
        return 'text-accent-foreground';
      default:
        return 'text-foreground';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-soft">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AgriChain</h1>
            <p className="text-xs text-muted-foreground">Farm to Fork Transparency</p>
          </div>
        </Link>

        {/* User Info and Actions */}
        {user && (
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            <div className="flex items-center space-x-2 rounded-xl bg-card px-3 py-2 shadow-soft">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Role: </span>
                <span className={`font-semibold ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>

            {/* Profile Button */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link to="/profile">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">{user.email}</span>
              </Link>
            </Button>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-destructive border-destructive/20 hover:bg-destructive/5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};