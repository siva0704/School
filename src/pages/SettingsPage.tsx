import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeAndLayout } from '@/contexts/ThemeAndLayoutContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';

const SettingsPage = () => {
  const { user, role } = useAuth();
  const { theme, layout, setTheme, setLayout } = useThemeAndLayout();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  // Different settings views based on user role
  const renderSettingsForRole = () => {
    if (role === 'admin') {
      return renderAdminSettings();
    } else if (role === 'teacher') {
      return renderTeacherSettings();
    } else if (role === 'student') {
      return renderStudentSettings();
    } else {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You don't have permission to view this page.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }
  };

  // Admin settings view with full system configuration
  const renderAdminSettings = () => {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>
                Basic information about your school
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input id="schoolName" defaultValue="Vidya Public School" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolCode">School Code</Label>
                  <Input id="schoolCode" defaultValue="VPS123456" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="info@vidyaschool.edu.in" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input id="phone" defaultValue="011-23456789" />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" defaultValue="123 Education Lane, Knowledge City, India - 110001" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>School Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 border rounded-md flex items-center justify-center bg-gray-50">
                    Logo
                  </div>
                  <div className="space-y-2">
                    <Input id="logo" type="file" />
                    <p className="text-xs text-gray-500">Recommended size: 200x200 px</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="academic" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Settings</CardTitle>
              <CardDescription>
                Configure academic year and grading system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Current Academic Year</Label>
                  <Input id="academicYear" defaultValue="2023-2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Academic Year Start Date</Label>
                  <Input id="startDate" type="date" defaultValue="2023-04-01" />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Grading System</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gradeA">Grade A+</Label>
                      <div className="flex items-center">
                        <Input id="gradeA" className="w-16 mr-2" defaultValue="90" />
                        <span className="text-gray-500">% and above</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeB">Grade A</Label>
                      <div className="flex items-center">
                        <Input id="gradeB" className="w-16 mr-2" defaultValue="80" />
                        <span className="text-gray-500">% and above</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeC">Grade B</Label>
                      <div className="flex items-center">
                        <Input id="gradeC" className="w-16 mr-2" defaultValue="70" />
                        <span className="text-gray-500">% and above</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeD">Grade C</Label>
                      <div className="flex items-center">
                        <Input id="gradeD" className="w-16 mr-2" defaultValue="60" />
                        <span className="text-gray-500">% and above</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeE">Grade D</Label>
                      <div className="flex items-center">
                        <Input id="gradeE" className="w-16 mr-2" defaultValue="50" />
                        <span className="text-gray-500">% and above</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeF">Grade F</Label>
                      <div className="flex items-center">
                        <Input id="gradeF" className="w-16 mr-2" defaultValue="0" />
                        <span className="text-gray-500">% and above</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Exam Weightage</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitTest">Unit Tests</Label>
                    <div className="flex items-center">
                      <Input id="unitTest" className="w-16 mr-2" defaultValue="10" />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quarterly">Quarterly Exam</Label>
                    <div className="flex items-center">
                      <Input id="quarterly" className="w-16 mr-2" defaultValue="20" />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="halfYearly">Half Yearly</Label>
                    <div className="flex items-center">
                      <Input id="halfYearly" className="w-16 mr-2" defaultValue="30" />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="final">Final Exam</Label>
                    <div className="flex items-center">
                      <Input id="final" className="w-16 mr-2" defaultValue="40" />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailAttendance">
                      Daily Attendance Report
                    </Label>
                    <Switch id="emailAttendance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailEvents">
                      New Events Notification
                    </Label>
                    <Switch id="emailEvents" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailResults">
                      Exam Results Publication
                    </Label>
                    <Switch id="emailResults" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailLessons">
                      New Lesson Plans
                    </Label>
                    <Switch id="emailLessons" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsAttendance">
                      Student Absence Alerts
                    </Label>
                    <Switch id="smsAttendance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsEmergency">
                      Emergency Notifications
                    </Label>
                    <Switch id="smsEmergency" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsResults">
                      Exam Results
                    </Label>
                    <Switch id="smsResults" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appAttendance">
                      Attendance Updates
                    </Label>
                    <Switch id="appAttendance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appEvents">
                      Events Reminders
                    </Label>
                    <Switch id="appEvents" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appResults">
                      Results Publication
                    </Label>
                    <Switch id="appResults" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appLessons">
                      New Learning Materials
                    </Label>
                    <Switch id="appLessons" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
                <RadioGroup 
                  defaultValue={theme} 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  onValueChange={(value) => setTheme(value as 'default' | 'dark' | 'gradient')}
                >
                  <div className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer ${theme === 'default' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-800' : ''}`}>
                    <div className="h-32 w-full bg-white shadow-sm rounded flex items-center justify-center">
                      Default Theme
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="default" id="theme-default" className="mr-2" />
                      <Label htmlFor="theme-default">Default</Label>
                    </div>
                  </div>
                  <div className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer ${theme === 'dark' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-800' : ''}`}>
                    <div className="h-32 w-full bg-gray-900 shadow-sm rounded flex items-center justify-center text-white">
                      Dark Theme
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="dark" id="theme-dark" className="mr-2" />
                      <Label htmlFor="theme-dark">Dark</Label>
                    </div>
                  </div>
                  <div className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer ${theme === 'gradient' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-800' : ''}`}>
                    <div className="h-32 w-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-sm rounded flex items-center justify-center text-white">
                      Gradient Theme
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="gradient" id="theme-gradient" className="mr-2" />
                      <Label htmlFor="theme-gradient">Gradient</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Dashboard Layout</h3>
                <RadioGroup 
                  defaultValue={layout} 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onValueChange={(value) => setLayout(value as 'sidebar' | 'horizontal')}
                >
                  <div className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer ${layout === 'sidebar' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-800' : ''}`}>
                    <div className="h-32 w-full bg-white shadow-sm rounded flex flex-col">
                      <div className="h-6 bg-gray-100 w-full"></div>
                      <div className="flex flex-1">
                        <div className="w-1/4 bg-gray-100"></div>
                        <div className="w-3/4 p-2">
                          <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-100 w-1/2"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="sidebar" id="layout-sidebar" className="mr-2" />
                      <Label htmlFor="layout-sidebar">Sidebar Layout</Label>
                    </div>
                  </div>
                  <div className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer ${layout === 'horizontal' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-800' : ''}`}>
                    <div className="h-32 w-full bg-white shadow-sm rounded flex flex-col">
                      <div className="h-6 bg-gray-100 w-full"></div>
                      <div className="h-6 bg-gray-200 w-full"></div>
                      <div className="flex-1 p-2">
                        <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-100 w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="horizontal" id="layout-horizontal" className="mr-2" />
                      <Label htmlFor="layout-horizontal">Horizontal Layout</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  // Teacher settings view
  const renderTeacherSettings = () => {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="classroom">Classroom</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Preferences</CardTitle>
              <CardDescription>
                Customize your teaching experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="teacherShowEmail">
                    Show email to students
                  </Label>
                  <Switch id="teacherShowEmail" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="teacherShowPhone">
                    Show phone number to students
                  </Label>
                  <Switch id="teacherShowPhone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherOfficeHours">Office Hours</Label>
                  <Input 
                    id="teacherOfficeHours" 
                    placeholder="e.g., Mon-Fri 2:00 PM - 3:00 PM" 
                    defaultValue="Mon-Fri 2:00 PM - 3:00 PM" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classroom" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Classroom Settings</CardTitle>
              <CardDescription>
                Configure your classroom preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoGrading">
                    Enable auto-grading for quizzes
                  </Label>
                  <Switch id="autoGrading" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowLateSubmission">
                    Allow late submissions
                  </Label>
                  <Switch id="allowLateSubmission" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeVisibility">Grade Visibility</Label>
                  <select 
                    id="gradeVisibility" 
                    className="w-full border rounded-md p-2"
                    defaultValue="immediately"
                  >
                    <option value="immediately">Show grades immediately</option>
                    <option value="manually">Show grades when manually released</option>
                    <option value="after">Show grades after all submissions</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAssignments">
                    Assignment submissions
                  </Label>
                  <Switch id="emailAssignments" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailQuestions">
                    Student questions
                  </Label>
                  <Switch id="emailQuestions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAnnouncements">
                    School announcements
                  </Label>
                  <Switch id="emailAnnouncements" defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  // Student settings view
  const renderStudentSettings = () => {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Preferences</CardTitle>
              <CardDescription>
                Customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">
                    Dark Mode
                  </Label>
                  <Switch id="darkMode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showGrades">
                    Show grades on dashboard
                  </Label>
                  <Switch id="showGrades" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language Preference</Label>
                  <select 
                    id="language" 
                    className="w-full border rounded-md p-2"
                    defaultValue="english"
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAssignments">
                    New assignments
                  </Label>
                  <Switch id="emailAssignments" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailGrades">
                    Grade updates
                  </Label>
                  <Switch id="emailGrades" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAnnouncements">
                    School announcements
                  </Label>
                  <Switch id="emailAnnouncements" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsEmergency">
                    Emergency notifications (SMS)
                  </Label>
                  <Switch id="smsEmergency" defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showOnlineStatus">
                    Show online status
                  </Label>
                  <Switch id="showOnlineStatus" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showEmail">
                    Show email to classmates
                  </Label>
                  <Switch id="showEmail" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowMessages">
                    Allow direct messages from classmates
                  </Label>
                  <Switch id="allowMessages" defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Settings</h2>
      {renderSettingsForRole()}
    </div>
  );
};

export default SettingsPage;
