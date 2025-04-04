
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { School } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="flex-1 bg-gradient-to-br from-erp-primary to-erp-dark text-white">
        <div className="container mx-auto px-4 py-12 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <School size={40} className="text-erp-secondary" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Vidya ERP</h1>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
              School Management System for Indian Education
            </h2>
            
            <p className="text-lg opacity-90 mb-8 max-w-2xl">
              A comprehensive solution designed specifically for Indian schools, 
              streamlining administration, enhancing learning, and connecting 
              students, teachers, and administrators.
            </p>
            
            <div className="space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')} 
                className="bg-white text-erp-primary hover:bg-gray-100"
              >
                Login to System
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-erp-primary">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-erp-primary">Digital Attendance</h3>
              <p className="text-gray-600">
                Easy class-wise attendance tracking with detailed reporting and analytics.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-erp-primary">Academic Management</h3>
              <p className="text-gray-600">
                Lesson plans, recorded classes, and comprehensive results management.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-erp-primary">Administration</h3>
              <p className="text-gray-600">
                Manage students, teachers, classes, and school events efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Vidya ERP | School Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
