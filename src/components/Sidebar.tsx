
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  Home,
  Users,
  BookOpen,
  CalendarCheck,
  FileText,
  ClipboardList,
  BookOpen as Book,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  School
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers";
import { useThemeAndLayout } from "@/contexts/ThemeAndLayoutContext";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useThemeAndLayout();

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Profile', href: '/profile', icon: User },
    ];

    const adminItems = [
      { name: 'Teachers', href: '/teachers', icon: Users },
      { name: 'Students', href: '/students', icon: Users },
      { name: 'Classes', href: '/classes', icon: BookOpen },
      { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
      { name: 'Lesson Plans', href: '/lesson-plans', icon: FileText },
      { name: 'Recorded Classes', href: '/recorded-classes', icon: Book },
      { name: 'Results', href: '/results', icon: ClipboardList },
      { name: 'Events', href: '/events', icon: Bell },
      { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const teacherItems = [
      { name: 'My Classes', href: '/my-classes', icon: BookOpen },
      { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
      { name: 'Lesson Plans', href: '/lesson-plans', icon: FileText },
      { name: 'Recorded Classes', href: '/recorded-classes', icon: Book },
      { name: 'Results', href: '/results', icon: ClipboardList },
      { name: 'Events', href: '/events', icon: Bell },
    ];

    const studentItems = [
      { name: 'My Attendance', href: '/attendance', icon: CalendarCheck },
      { name: 'My Lesson Plans', href: '/lesson-plans', icon: FileText },
      { name: 'My Recorded Classes', href: '/recorded-classes', icon: Book },
      { name: 'My Results', href: '/results', icon: ClipboardList },
      { name: 'Events', href: '/events', icon: Bell },
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

  // Determine sidebar classes based on theme
  const sidebarClass = cn(
    "flex flex-col h-screen text-white transition-all duration-300",
    theme === 'gradient' 
      ? 'gradient-sidebar' 
      : 'bg-erp-primary dark:bg-gray-800',
    collapsed ? "w-16" : "w-64",
    className
  );

  return (
    <div className={sidebarClass}>
      {/* Logo and title */}
      <div className="flex items-center py-4 px-2">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-erp-primary">
          <School size={24} />
        </div>
        {!collapsed && (
          <div className="ml-2 font-bold text-lg">Vidya ERP</div>
        )}
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-white/10"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      {/* User info */}
      <div className={cn("border-y border-white/10 py-4", 
                         collapsed ? "flex justify-center" : "px-4")}>
        <div className={cn("flex items-center", collapsed ? "" : "space-x-3")}>
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name || ''} />
            <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-medium truncate">{user?.name}</div>
              <div className="text-xs text-gray-300 capitalize">{role}</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive 
                        ? "bg-white/10 hover:bg-white/20" 
                        : "hover:bg-white/10",
                      collapsed ? "justify-center px-0" : ""
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-2 border-t border-white/10">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-white hover:bg-white/10",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
