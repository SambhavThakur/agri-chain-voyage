import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

export const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${isAuthenticated ? 'lg:ml-0' : ''}`}>
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};