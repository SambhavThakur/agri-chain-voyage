import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import TransporterDashboard from "./pages/TransporterDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Role-specific Route Component
const RoleRoute = ({ allowedRole, children }: { allowedRole: string; children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== allowedRole) {
    return <Navigate to={`/${user?.role || 'login'}`} replace />;
  }
  
  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <Login />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect based on user role */}
        <Route 
          index 
          element={
            user ? <Navigate to={`/${user.role}`} replace /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Role-specific Dashboards */}
        <Route
          path="farmer"
          element={
            <RoleRoute allowedRole="farmer">
              <FarmerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="transporter"
          element={
            <RoleRoute allowedRole="transporter">
              <TransporterDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="retailer"
          element={
            <RoleRoute allowedRole="retailer">
              <RetailerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="consumer"
          element={
            <RoleRoute allowedRole="consumer">
              <ConsumerDashboard />
            </RoleRoute>
          }
        />
        
        {/* Shared Protected Routes */}
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
