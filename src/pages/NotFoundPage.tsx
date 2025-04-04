
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SearchX } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-gray-100 p-6 rounded-full">
            <SearchX className="h-16 w-16 text-erp-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
        
        <p className="text-xl text-gray-600 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="mt-8">
          <Button asChild className="bg-erp-primary hover:bg-erp-dark">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
