import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Teacher } from '@/types';
import { BookOpen, Users, CalendarCheck, FileText, Video, ClipboardList, FileBarChart } from 'lucide-react';

const MyClassesPage = () => {
  const { role, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  // Only teachers can access this page
  if (role !== 'teacher') {
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

  // Type cast the user to Teacher type
  const teacherData = user as Teacher;
  
  // Assigned class assignments for the teacher
  const classAssignments = [
    { classId: 5, section: 'A', subjectId: 'Mathematics', students: 30, schedule: [
      { day: 'Monday', time: '9:00 AM - 9:45 AM' },
      { day: 'Wednesday', time: '10:00 AM - 10:45 AM' },
      { day: 'Friday', time: '11:00 AM - 11:45 AM' },
    ]},
    { classId: 6, section: 'B', subjectId: 'Mathematics', students: 28, schedule: [
      { day: 'Tuesday', time: '9:00 AM - 9:45 AM' },
      { day: 'Thursday', time: '10:00 AM - 10:45 AM' },
      { day: 'Friday', time: '9:00 AM - 9:45 AM' },
    ]},
    { classId: 7, section: 'A', subjectId: 'Mathematics', students: 32, schedule: [
      { day: 'Monday', time: '11:00 AM - 11:45 AM' },
      { day: 'Wednesday', time: '9:00 AM - 9:45 AM' },
      { day: 'Thursday', time: '11:00 AM - 11:45 AM' },
    ]},
  ];
  
  // Navigation handlers for attendance and results
  const handleNavigateToAttendance = (classId: number, section: string) => {
    navigate(`/attendance?class=${classId}&section=${section}`);
  };

  const handleNavigateToResults = (classId: number, section: string) => {
    navigate(`/results?class=${classId}&section=${section}`);
  };
  
  // Sample students for class 5A
  const studentsClass5A = [
    { id: '1', name: 'Rahul Sharma', rollNumber: '01', attendance: 95, progress: 'Good' },
    { id: '2', name: 'Priya Patel', rollNumber: '02', attendance: 98, progress: 'Excellent' },
    { id: '3', name: 'Amit Kumar', rollNumber: '03', attendance: 85, progress: 'Average' },
    { id: '4', name: 'Nisha Singh', rollNumber: '04', attendance: 92, progress: 'Good' },
    { id: '5', name: 'Vikram Malhotra', rollNumber: '05', attendance: 88, progress: 'Good' },
    { id: '6', name: 'Kavita Reddy', rollNumber: '06', attendance: 90, progress: 'Good' },
    { id: '7', name: 'Suresh Nair', rollNumber: '07', attendance: 94, progress: 'Excellent' },
    { id: '8', name: 'Ananya Das', rollNumber: '08', attendance: 96, progress: 'Excellent' },
  ];
  
  // Sample lesson plans
  const lessonPlans = [
    {
      id: '1',
      title: 'Introduction to Fractions',
      classId: 5,
      section: 'A',
      subjectId: 'Mathematics',
      dateRange: { start: '2023-08-01', end: '2023-08-10' },
      status: 'Completed'
    },
    {
      id: '2',
      title: 'Decimal Numbers',
      classId: 5,
      section: 'A',
      subjectId: 'Mathematics',
      dateRange: { start: '2023-08-11', end: '2023-08-20' },
      status: 'In Progress'
    },
    {
      id: '3',
      title: 'Algebraic Expressions',
      classId: 6,
      section: 'B',
      subjectId: 'Mathematics',
      dateRange: { start: '2023-08-05', end: '2023-08-15' },
      status: 'In Progress'
    },
    {
      id: '4',
      title: 'Geometry Basics',
      classId: 7,
      section: 'A',
      subjectId: 'Mathematics',
      dateRange: { start: '2023-08-08', end: '2023-08-18' },
      status: 'Scheduled'
    },
  ];
  
  // Sample upcoming events
  const upcomingEvents = [
    { 
      id: '1', 
      title: 'Mathematics Quiz', 
      date: '2023-08-25', 
      classId: 5, 
      section: 'A' 
    },
    { 
      id: '2', 
      title: 'Parent-Teacher Meeting', 
      date: '2023-08-28',
      classId: 6, 
      section: 'B' 
    },
    { 
      id: '3', 
      title: 'Mathematics Quiz', 
      date: '2023-08-30',
      classId: 7, 
      section: 'A' 
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">My Classes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classAssignments.map((assignment, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-md">
              Mathematics
            </div>
            <CardHeader className="pb-3">
              <CardTitle>Class {assignment.classId}-{assignment.section}</CardTitle>
              <CardDescription>{assignment.students} Students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Schedule:</h4>
                <ul className="text-xs text-gray-500 space-y-1">
                  {assignment.schedule.map((slot, idx) => (
                    <li key={idx}>
                      {slot.day}: {slot.time}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => handleNavigateToAttendance(assignment.classId, assignment.section)}
                >
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  Attendance
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => handleNavigateToResults(assignment.classId, assignment.section)}
                >
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Results
                </Button>
              </div>
              <Button variant="default" size="sm" className="w-full">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Class 5-A (Mathematics)</CardTitle>
          <CardDescription>Manage class activities and students</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-full p-2 bg-blue-100">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-500">Students</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">30</p>
                    <p className="text-xs text-gray-500">17 Boys, 13 Girls</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-full p-2 bg-green-100">
                      <CalendarCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-500">Attendance</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-xs text-gray-500">Today's Attendance</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-full p-2 bg-amber-100">
                      <ClipboardList className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-sm text-gray-500">Completion</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">45%</p>
                    <p className="text-xs text-gray-500">Syllabus Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Current Lesson Plan</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium">Decimal Numbers</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Understanding decimal place value and operations with decimal numbers
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-3">
                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          In Progress
                        </span>
                        <span className="mx-2">•</span>
                        <span>Aug 11 - Aug 20</span>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>60%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <h3 className="text-lg font-medium mt-6 mb-3">Upcoming Events</h3>
                  <div className="space-y-3">
                    {upcomingEvents.filter(event => event.classId === 5 && event.section === 'A').map(event => (
                      <div key={event.id} className="flex items-start gap-3 p-3 border rounded-md">
                        <div className="flex-shrink-0 w-10 h-10 rounded-md bg-blue-100 flex flex-col items-center justify-center text-center text-blue-600">
                          <span className="text-sm font-bold">{new Date(event.date).getDate()}</span>
                          <span className="text-xs">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-xs text-gray-500">
                            Class {event.classId}-{event.section}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Recent Activities</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full p-2 bg-green-100">
                          <CalendarCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Attendance Marked</h4>
                          <p className="text-xs text-gray-500">Today at 9:15 AM</p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full p-2 bg-blue-100">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Homework Assigned</h4>
                          <p className="text-xs text-gray-500">Yesterday at 10:30 AM</p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full p-2 bg-purple-100">
                          <Video className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Class Recording Uploaded</h4>
                          <p className="text-xs text-gray-500">Aug 18 at 2:45 PM</p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full p-2 bg-amber-100">
                          <ClipboardList className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Unit Test Results Updated</h4>
                          <p className="text-xs text-gray-500">Aug 15 at 4:30 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="students">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsClass5A.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.attendance}%</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs
                          ${student.progress === 'Excellent' ? 'bg-green-100 text-green-800' : ''}
                          ${student.progress === 'Good' ? 'bg-blue-100 text-blue-800' : ''}
                          ${student.progress === 'Average' ? 'bg-amber-100 text-amber-800' : ''}
                          ${student.progress === 'Poor' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {student.progress}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="attendance">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Class 5-A Attendance</h3>
                  <Button>Take Attendance</Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-around">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">92%</div>
                        <p className="text-sm text-gray-500">Overall</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">95%</div>
                        <p className="text-sm text-gray-500">This Week</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-600">28</div>
                        <p className="text-sm text-gray-500">Present Today</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">2</div>
                        <p className="text-sm text-gray-500">Absent Today</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Records</CardTitle>
                    <CardDescription>Past 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Absent</TableHead>
                          <TableHead>Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>2023-08-21</TableCell>
                          <TableCell>28</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell>93.3%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2023-08-18</TableCell>
                          <TableCell>29</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>96.7%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2023-08-17</TableCell>
                          <TableCell>27</TableCell>
                          <TableCell>3</TableCell>
                          <TableCell>90%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2023-08-16</TableCell>
                          <TableCell>30</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>100%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2023-08-14</TableCell>
                          <TableCell>28</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell>93.3%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="lessons">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Lesson Plans</h3>
                  <Button>Create Lesson Plan</Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessonPlans
                      .filter(plan => plan.classId === 5 && plan.section === 'A')
                      .map(plan => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.title}</TableCell>
                          <TableCell>
                            {new Date(plan.dateRange.start).toLocaleDateString()} - {new Date(plan.dateRange.end).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs
                              ${plan.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                              ${plan.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : ''}
                              ${plan.status === 'Scheduled' ? 'bg-amber-100 text-amber-800' : ''}
                            `}>
                              {plan.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Study Materials</CardTitle>
                    <CardDescription>Uploaded materials for Class 5-A</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Fractions Worksheet</h4>
                            <p className="text-xs text-gray-500">PDF • Uploaded 2 weeks ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded">
                            <Video className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Decimal Numbers Introduction</h4>
                            <p className="text-xs text-gray-500">Video • Uploaded 3 days ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Decimal Practice Questions</h4>
                            <p className="text-xs text-gray-500">PDF • Uploaded 2 days ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Results & Assessments</h3>
                  <Button>Enter Marks</Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Unit Test 1 Results</CardTitle>
                    <CardDescription>Mathematics • Max Marks: 25</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="border rounded-lg p-4">
                        <div className="text-2xl font-bold">21.4</div>
                        <p className="text-xs text-gray-500">Class Average</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-2xl font-bold">25</div>
                        <p className="text-xs text-gray-500">Highest Score</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-2xl font-bold">16</div>
                        <p className="text-xs text-gray-500">Lowest Score</p>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Marks</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentsClass5A.slice(0, 5).map(student => (
                          <TableRow key={student.id}>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>
                              {Math.floor(Math.random() * 10) + 16}/25
                            </TableCell>
                            <TableCell>
                              {['A', 'A', 'B', 'A', 'B'][parseInt(student.rollNumber) - 1]}
                            </TableCell>
                            <TableCell>
                              {[
                                'Excellent performance',
                                'Very good',
                                'Good, needs improvement in chapter 3',
                                'Very good work',
                                'Good, focus on problem solving'
                              ][parseInt(student.rollNumber) - 1]}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">View All Results</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">Decimal Numbers Quiz</h4>
                          <p className="text-xs text-gray-500">25 marks • August 25, 2023</p>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">Unit Test 2</h4>
                          <p className="text-xs text-gray-500">50 marks • September 10, 2023</p>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyClassesPage;
