
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeAndLayoutProvider } from "@/contexts/ThemeAndLayoutContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";

// Import all module pages
import TeachersPage from "./pages/TeachersPage";
import StudentsPage from "./pages/StudentsPage";
import ClassesPage from "./pages/ClassesPage";
import AttendancePage from "./pages/AttendancePage";
import LessonPlansPage from "./pages/LessonPlansPage";
import RecordedClassesPage from "./pages/RecordedClassesPage";
import ResultsPage from "./pages/ResultsPage";
import EventsPage from "./pages/EventsPage";
import SettingsPage from "./pages/SettingsPage";
import MyClassesPage from "./pages/MyClassesPage";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter basename="/School">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeAndLayoutProvider>
            {/* Move TooltipProvider inside these providers */}
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  
                  {/* Admin & Teacher routes */}
                  <Route path="teachers" element={<TeachersPage />} />
                  <Route path="students" element={<StudentsPage />} />
                  <Route path="classes" element={<ClassesPage />} />
                  
                  {/* Shared routes (all roles) */}
                  <Route path="attendance" element={<AttendancePage />} />
                  <Route path="lesson-plans" element={<LessonPlansPage />} />
                  <Route path="recorded-classes" element={<RecordedClassesPage />} />
                  <Route path="results" element={<ResultsPage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  
                  {/* Teacher specific routes */}
                  <Route path="my-classes" element={<MyClassesPage />} />
                  
                  {/* Admin specific routes */}
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </TooltipProvider>
          </ThemeAndLayoutProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
