
import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import HorizontalLayout from "@/components/HorizontalLayout";
import { useThemeAndLayout } from "@/contexts/ThemeAndLayoutContext";
import { Bell, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers";

const Layout = () => {
  const { user, role, isLoading, logout } = useAuth();
  const location = useLocation();
  const { layout, theme } = useThemeAndLayout();
  const [pageTitle, setPageTitle] = useState("");
  const navigate = useNavigate();
  
  // Set page title based on current path
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/dashboard') setPageTitle('Dashboard');
    else if (path === '/teachers') setPageTitle('Teachers Management');
    else if (path === '/students') setPageTitle('Students Management');
    else if (path === '/classes') setPageTitle('Classes Management');
    else if (path === '/attendance') setPageTitle('Attendance');
    else if (path === '/lesson-plans') setPageTitle('Lesson Plans');
    else if (path === '/recorded-classes') setPageTitle('Recorded Classes');
    else if (path === '/results') setPageTitle('Results');
    else if (path === '/events') setPageTitle('Events & Calendar');
    else if (path === '/settings') setPageTitle('Settings');
    else if (path === '/my-classes') setPageTitle('My Classes');
    else if (path === '/profile') setPageTitle('My Profile');
    else setPageTitle('Vidya ERP');
  }, [location.pathname]);

  // If still loading auth state, show loading
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-t-erp-secondary border-erp-primary rounded-full animate-spin mx-auto mb-4 ${
            theme === 'gradient' ? 'border-t-purple-500 border-blue-500' : ''
          }`}></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render based on layout preference
  if (layout === 'horizontal') {
    return <HorizontalLayout />;
  }

  // Default to sidebar layout
  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''} ${theme === 'gradient' ? 'theme-gradient' : ''}`}>
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className={`${theme === 'gradient' ? 'gradient-header text-white' : 'bg-white dark:bg-gray-800'} shadow-sm border-b z-10`}>
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className={`text-xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-erp-primary dark:text-white'}`}>
              {pageTitle}
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="px-4 py-3 font-medium">Notifications</div>
                  <DropdownMenuSeparator />
                  <div className="py-6 text-center text-sm text-gray-500">
                    No new notifications
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center space-x-2 p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name || ''} />
                      <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className={`flex-1 overflow-y-auto p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
