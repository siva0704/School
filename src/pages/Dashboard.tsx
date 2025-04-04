
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  CalendarCheck, 
  ClipboardList, 
  User, 
  Bell, 
  Clock 
} from 'lucide-react';
import { dashboardStats, schoolEvents } from '@/data/mock-data';
import { formatDate, formatDateTime } from '@/utils/helpers';
import { Student } from '@/types';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { role, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  const formattedDate = currentTime.toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Sample attendance data for charts
  const attendanceData = [
    { name: 'Mon', present: 95, absent: 5 },
    { name: 'Tue', present: 92, absent: 8 },
    { name: 'Wed', present: 88, absent: 12 },
    { name: 'Thu', present: 96, absent: 4 },
    { name: 'Fri', present: 90, absent: 10 },
  ];

  // Sample performance data
  const performanceData = [
    { name: 'Unit Test 1', avg: 78 },
    { name: 'Quarterly', avg: 82 },
    { name: 'Unit Test 2', avg: 75 },
    { name: 'Half Yearly', avg: 80 },
  ];

  // Sample subject-wise performance
  const subjectData = [
    { name: 'English', value: 85 },
    { name: 'Hindi', value: 72 },
    { name: 'Mathematics', value: 90 },
    { name: 'Science', value: 78 },
    { name: 'Social Science', value: 82 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Admin Dashboard
  if (role === 'admin') {
    return (
      <div className="space-y-8">
        {/* Header with time and stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Welcome back, {user?.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {formattedTime} | {formattedDate}
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.attendanceToday.percentage}%</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.attendanceToday.present} present / {dashboardStats.attendanceToday.absent} absent
              </p>
              <div className="mt-4 h-4 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-4 bg-green-500 transition-all"
                  style={{ width: `${dashboardStats.attendanceToday.percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="rounded-full p-3 bg-blue-100">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-3xl font-bold">{dashboardStats.totalStudents}</h3>
              <p className="text-sm text-gray-500">Total Students</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="rounded-full p-3 bg-green-100">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-3xl font-bold">{dashboardStats.totalTeachers}</h3>
              <p className="text-sm text-gray-500">Total Teachers</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="rounded-full p-3 bg-amber-100">
                <BookOpen className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="mt-4 text-3xl font-bold">{dashboardStats.totalClasses}</h3>
              <p className="text-sm text-gray-500">Total Classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="rounded-full p-3 bg-purple-100">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mt-4 text-3xl font-bold">{dashboardStats.upcomingEvents}</h3>
              <p className="text-sm text-gray-500">Upcoming Events</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" name="Present %" fill="#4ade80" />
                  <Bar dataKey="absent" name="Absent %" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Performance Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avg" name="Average Score" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schoolEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-shrink-0 p-2 rounded-full bg-blue-100">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateTime(event.startDateTime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Teacher Dashboard
  else if (role === 'teacher') {
    return (
      <div className="space-y-8">
        {/* Header with time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Welcome back, {user?.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {formattedTime} | {formattedDate}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Today's Classes</span>
                <span className="text-3xl font-bold mt-1">5</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Pending Assignments</span>
                <span className="text-3xl font-bold mt-1">3</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Attendance Today</span>
                <span className="text-3xl font-bold mt-1">95%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class schedule for today */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Mathematics - Class 5A</h4>
                    <p className="text-sm text-gray-500">Chapter 3: Fractions</p>
                  </div>
                </div>
                <span className="text-sm font-medium">9:00 AM - 9:45 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Mathematics - Class 2B</h4>
                    <p className="text-sm text-gray-500">Chapter 2: Addition & Subtraction</p>
                  </div>
                </div>
                <span className="text-sm font-medium">10:00 AM - 10:45 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Science - Class 3A</h4>
                    <p className="text-sm text-gray-500">Chapter 4: Plants & Animals</p>
                  </div>
                </div>
                <span className="text-sm font-medium">11:30 AM - 12:15 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Attendance</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Class 2B', attendance: 92 },
                    { name: 'Class 3A', attendance: 88 },
                    { name: 'Class 5A', attendance: 95 },
                  ]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendance" name="Attendance %" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Excellent', value: 40 },
                      { name: 'Good', value: 30 },
                      { name: 'Average', value: 20 },
                      { name: 'Below Average', value: 10 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schoolEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-shrink-0 p-2 rounded-full bg-blue-100">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateTime(event.startDateTime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student Dashboard
  else if (role === 'student') {
    // Type cast the user to Student type
    const studentData = user as Student;
    
    return (
      <div className="space-y-8">
        {/* Header with time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Welcome back, {user?.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {formattedTime} | {formattedDate}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">My Class</span>
                  <span className="text-3xl font-bold mt-1">
                    {studentData.class}{studentData.section}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Roll Number</span>
                  <span className="text-3xl font-bold mt-1">
                    {studentData.rollNumber}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Attendance</span>
                  <span className="text-3xl font-bold mt-1">92%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timetable for today */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Mathematics</h4>
                    <p className="text-sm text-gray-500">Mrs. Anjali Gupta</p>
                  </div>
                </div>
                <span className="text-sm font-medium">9:00 AM - 9:45 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">English</h4>
                    <p className="text-sm text-gray-500">Mr. Suresh Verma</p>
                  </div>
                </div>
                <span className="text-sm font-medium">10:00 AM - 10:45 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Science</h4>
                    <p className="text-sm text-gray-500">Mrs. Meena Iyer</p>
                  </div>
                </div>
                <span className="text-sm font-medium">11:30 AM - 12:15 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avg" name="My Score" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schoolEvents
                .filter(event => !event.forClasses || event.forClasses.includes(studentData?.class || 0))
                .slice(0, 3)
                .map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <div className="flex-shrink-0 p-2 rounded-full bg-blue-100">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(event.startDateTime)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Vidya ERP</CardTitle>
          <CardDescription>School Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please log in to access the system.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
