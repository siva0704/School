
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User, Settings, LogOut, School, Menu } from "lucide-react";
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
import { useThemeAndLayout } from "@/contexts/ThemeAndLayoutContext";

const HorizontalLayout = () => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useThemeAndLayout();
  
  // Get navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
      { name: 'Profile', href: '/profile', icon: 'profile' },
    ];

    const adminItems = [
      { name: 'Teachers', href: '/teachers', icon: 'teachers' },
      { name: 'Students', href: '/students', icon: 'students' },
      { name: 'Classes', href: '/classes', icon: 'classes' },
      { name: 'Attendance', href: '/attendance', icon: 'attendance' },
      { name: 'Lesson Plans', href: '/lesson-plans', icon: 'lessons' },
      { name: 'Recorded Classes', href: '/recorded-classes', icon: 'recordings' },
      { name: 'Results', href: '/results', icon: 'results' },
      { name: 'Events', href: '/events', icon: 'events' },
      { name: 'Settings', href: '/settings', icon: 'settings' },
    ];

    const teacherItems = [
      { name: 'My Classes', href: '/my-classes', icon: 'classes' },
      { name: 'Attendance', href: '/attendance', icon: 'attendance' },
      { name: 'Lesson Plans', href: '/lesson-plans', icon: 'lessons' },
      { name: 'Recorded Classes', href: '/recorded-classes', icon: 'recordings' },
      { name: 'Results', href: '/results', icon: 'results' },
      { name: 'Events', href: '/events', icon: 'events' },
    ];

    const studentItems = [
      { name: 'Attendance', href: '/attendance', icon: 'attendance' },
      { name: 'Lesson Plans', href: '/lesson-plans', icon: 'lessons' },
      { name: 'Recorded Classes', href: '/recorded-classes', icon: 'recordings' },
      { name: 'Results', href: '/results', icon: 'results' },
      { name: 'Events', href: '/events', icon: 'events' },
    ];

    switch (role) {
      case 'admin':
        return [...commonItems, ...adminItems];
      case 'teacher':
        return [...commonItems, ...teacherItems];
      case 'student':
        return [...commonItems, ...studentItems];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'gradient' ? 'theme-gradient' : ''}`}>
      {/* Top navigation */}
      <header className={`sticky top-0 z-30 w-full border-b ${theme === 'gradient' ? 'gradient-header text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and school name */}
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-erp-primary mr-2">
                <School size={24} />
              </div>
              <span className="font-bold text-lg">Vidya ERP</span>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`${theme === 'gradient' ? 'text-white hover:bg-white/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Menu />
              </Button>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href}>
                    <Button 
                      variant={isActive ? "secondary" : "ghost"}
                      className={`${theme === 'gradient' && !isActive ? 'hover:bg-white/20 text-white' : ''}`}
                    >
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
            
            {/* User menu and notifications */}
            <div className="flex items-center space-x-2">
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
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-md ${isActive 
                    ? 'bg-gray-100 dark:bg-gray-700 font-medium' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default HorizontalLayout;
