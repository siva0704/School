
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Teacher } from '../types';
import { findUserByCredentials, getUserProfile } from '../data/mock-data';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  teacherAssignments: {
    classId: number;
    section: string;
    subjectId: string;
  }[] | null; // Add teacherAssignments property
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [teacherAssignments, setTeacherAssignments] = useState<{
    classId: number;
    section: string;
    subjectId: string;
  }[] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved auth data on load
    const savedUser = localStorage.getItem('erpUser');
    const savedToken = localStorage.getItem('erpToken');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(parsedUser.role as UserRole);
        
        // Set token if available
        if (savedToken) {
          setToken(savedToken);
        }

        // Set teacher assignments if user is a teacher
        if (parsedUser.role === 'teacher' && parsedUser.classes) {
          setTeacherAssignments(parsedUser.classes);
        }
      } catch (error) {
        console.error('Failed to parse saved user data');
        localStorage.removeItem('erpUser');
        localStorage.removeItem('erpToken');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = findUserByCredentials(email, password);
      
      if (foundUser) {
        const userProfile = getUserProfile(foundUser.id, foundUser.role);
        
        if (userProfile) {
          setUser(userProfile);
          setRole(foundUser.role as UserRole);
          
          // Generate a mock token and save it
          const mockToken = `mock-token-${Date.now()}`;
          setToken(mockToken);
          
          // Set teacher assignments if user is a teacher
          if (foundUser.role === 'teacher' && (userProfile as Teacher).classes) {
            setTeacherAssignments((userProfile as Teacher).classes);
          } else {
            setTeacherAssignments(null);
          }
          
          localStorage.setItem('erpUser', JSON.stringify(userProfile));
          localStorage.setItem('erpToken', mockToken);
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${userProfile.name}!`,
          });
          
          return true;
        }
      }
      
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    setTeacherAssignments(null);
    localStorage.removeItem('erpUser');
    localStorage.removeItem('erpToken');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      isLoading, 
      token, 
      login, 
      logout, 
      teacherAssignments 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
