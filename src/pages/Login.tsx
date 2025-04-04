
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SchoolIcon, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo login function
  const handleDemoLogin = async (role: string) => {
    setIsSubmitting(true);
    let demoEmail = '';
    
    switch (role) {
      case 'admin':
        demoEmail = 'principal@vidyaerp.com';
        break;
      case 'teacher':
        demoEmail = 'anjali@vidyaerp.com';
        break;
      case 'student':
        demoEmail = 'amit@vidyaerp.com';
        break;
      default:
        demoEmail = '';
    }
    
    try {
      const success = await login(demoEmail, `${role}123`);
      
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-erp-primary to-erp-dark p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <SchoolIcon size={48} className="text-erp-secondary" />
          </div>
          <CardTitle className="text-3xl font-bold text-erp-primary">Vidya ERP</CardTitle>
          <CardDescription className="text-lg">
            School Management System
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="demo">Demo Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-erp-primary hover:bg-erp-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="demo">
            <CardContent className="space-y-4 pt-4">
              <div className="text-center text-sm text-gray-500 mb-2">
                Click any option below to login with demo credentials
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isSubmitting}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login as Admin
                </Button>
                
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleDemoLogin('teacher')}
                  disabled={isSubmitting}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login as Teacher
                </Button>
                
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={() => handleDemoLogin('student')}
                  disabled={isSubmitting}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login as Student
                </Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
