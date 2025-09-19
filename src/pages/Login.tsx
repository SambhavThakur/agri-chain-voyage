import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Leaf, Mail, Lock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields including your role.",
        variant: "destructive",
      });
      return;
    }

    const success = await login(email, password, role as UserRole);
    
    if (success) {
      toast({
        title: "Welcome to AgriChain!",
        description: `Successfully logged in as ${role}.`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const roleOptions = [
    { value: 'farmer', label: 'Farmer', description: 'Grow and harvest crops' },
    { value: 'transporter', label: 'Transporter', description: 'Move products safely' },
    { value: 'retailer', label: 'Retailer', description: 'Sell to consumers' },
    { value: 'consumer', label: 'Consumer', description: 'Buy and verify products' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-fresh p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-primary shadow-strong">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AgriChain</h1>
            <p className="text-muted-foreground">
              Transparent supply chain from farm to fork
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-strong rounded-3xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your role and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Role
                </Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger className="h-12 rounded-xl border-2 bg-background">
                    <SelectValue placeholder="Select your role in the supply chain" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="rounded-lg">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 rounded-xl border-2 bg-background"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 rounded-xl border-2 bg-background"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="agricultural"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In to AgriChain'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Demo Mode: Use any email and password to sign in
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {roleOptions.map((option) => (
              <span key={option.value} className="px-2 py-1 bg-accent rounded-lg">
                {option.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}