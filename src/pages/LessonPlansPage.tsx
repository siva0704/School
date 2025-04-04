
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { lessonPlans } from '@/data/mock-data';
import { LessonPlan, Student } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileIcon, 
  CalendarIcon, 
  BookOpenIcon,
  SearchIcon, 
  DownloadIcon,
  FilterIcon 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const LessonPlansPage = () => {
  const { user, role } = useAuth();
  const [filteredLessonPlans, setFilteredLessonPlans] = useState<LessonPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Filter lesson plans based on user role and class
    if (role === 'student' && user) {
      // For students, only show lesson plans for their class/section
      // Cast user to Student type to access class and section properties
      const studentUser = user as Student;
      const studentPlans = lessonPlans.filter(plan => 
        plan.classId === studentUser.class && 
        (plan.section === studentUser.section || plan.section === 'All')
      );
      
      setFilteredLessonPlans(studentPlans);
    } else if (role === 'teacher' && user) {
      // For teachers, show lesson plans they created
      const teacherPlans = lessonPlans.filter(plan => plan.teacherId === user.id);
      setFilteredLessonPlans(teacherPlans);
    } else {
      // For admins or default, show all lesson plans
      setFilteredLessonPlans(lessonPlans);
    }
  }, [user, role]);

  // Filter by search term and active filter
  const displayedLessonPlans = filteredLessonPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') {
      return matchesSearch;
    } else if (activeFilter === 'current') {
      const now = new Date();
      const startDate = new Date(plan.dateRange.start);
      const endDate = new Date(plan.dateRange.end);
      return matchesSearch && now >= startDate && now <= endDate;
    } else if (activeFilter === 'upcoming') {
      const now = new Date();
      const startDate = new Date(plan.dateRange.start);
      return matchesSearch && now < startDate;
    } else { // past
      const now = new Date();
      const endDate = new Date(plan.dateRange.end);
      return matchesSearch && now > endDate;
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Lesson Plans</h2>
        <p className="text-muted-foreground">
          {role === 'student' 
            ? 'View lesson plans for your class' 
            : role === 'teacher' 
              ? 'Create and manage lesson plans for your classes'
              : 'Manage all lesson plans across the school'}
        </p>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Plans</TabsTrigger>
          {role !== 'student' && <TabsTrigger value="create">Create Plan</TabsTrigger>}
          {role !== 'student' && <TabsTrigger value="manage">Manage Plans</TabsTrigger>}
        </TabsList>

        {/* Browse Lesson Plans Tab */}
        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plans</CardTitle>
              <CardDescription>Browse through available lesson plans for your classes</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lesson plans..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <FilterIcon className="h-4 w-4 text-muted-foreground" />
                  <select
                    className="focus:ring-2 h-10 px-3 py-2 text-sm border rounded-md"
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                  >
                    <option value="all">All Plans</option>
                    <option value="current">Current</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>

              {/* Display filtered lesson plans */}
              {displayedLessonPlans.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {displayedLessonPlans.map((plan) => (
                      <Card key={plan.id} className="relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-2 h-full ${
                          new Date() > new Date(plan.dateRange.end) ? 'bg-gray-300' : 
                          new Date() < new Date(plan.dateRange.start) ? 'bg-blue-400' : 
                          'bg-green-400'
                        }`}></div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{plan.title}</CardTitle>
                              <CardDescription className="text-sm">
                                Class {plan.classId}{plan.section !== 'All' ? ` - Section ${plan.section}` : ''} 
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="font-normal">
                              {new Date() > new Date(plan.dateRange.end) ? 'Past' : 
                               new Date() < new Date(plan.dateRange.start) ? 'Upcoming' : 
                               'Current'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              <span>
                                {format(new Date(plan.dateRange.start), 'MMM d')} - {format(new Date(plan.dateRange.end), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <BookOpenIcon className="mr-1 h-4 w-4" />
                              <span>{
                                plan.subjectId.startsWith('math') ? 'Mathematics' : 
                                plan.subjectId.startsWith('eng') ? 'English' : 
                                plan.subjectId.startsWith('sci') ? 'Science' : 
                                plan.subjectId.startsWith('hin') ? 'Hindi' : 
                                plan.subjectId.startsWith('sst') ? 'Social Studies' : 
                                plan.subjectId
                              }</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-4 bg-muted rounded-md">
                            <h4 className="font-medium text-sm mb-2">Content Overview:</h4>
                            <pre className="text-xs font-mono whitespace-pre-wrap">{plan.content}</pre>
                          </div>
                          
                          {plan.attachments && plan.attachments.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium text-sm mb-2">Attachments:</h4>
                              <div className="flex flex-wrap gap-2">
                                {plan.attachments.map((attachment, index) => (
                                  <Button key={index} variant="outline" size="sm" className="text-xs">
                                    <FileIcon className="mr-2 h-3.5 w-3.5" />
                                    {attachment}
                                    <DownloadIcon className="ml-2 h-3.5 w-3.5" />
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-10">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No lesson plans found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search term or filters.' : 'No lesson plans are available for your class at this time.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Lesson Plan Tab - Only for teachers and admins */}
        {role !== 'student' && (
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Lesson Plan</CardTitle>
                <CardDescription>Create a new lesson plan for your class</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Enter lesson plan title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <select className="w-full h-10 px-3 py-2 text-sm border rounded-md focus:ring-2">
                        <option value="">Select Subject</option>
                        <option value="math">Mathematics</option>
                        <option value="eng">English</option>
                        <option value="sci">Science</option>
                        <option value="sst">Social Studies</option>
                        <option value="hin">Hindi</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <select className="w-full h-10 px-3 py-2 text-sm border rounded-md focus:ring-2">
                        <option value="">Select Class</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>Class {num}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <select className="w-full h-10 px-3 py-2 text-sm border rounded-md focus:ring-2">
                        <option value="All">All Sections</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Brief description of the lesson plan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Enter the detailed content of the lesson plan" 
                      className="min-h-[200px]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments</Label>
                    <Input id="attachments" type="file" multiple />
                    <p className="text-xs text-muted-foreground">Upload worksheets, presentations or additional materials</p>
                  </div>
                  <Button className="w-full sm:w-auto">Create Lesson Plan</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Manage Lesson Plans Tab - Only for teachers and admins */}
        {role !== 'student' && (
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Lesson Plans</CardTitle>
                <CardDescription>
                  {role === 'teacher' ? 'Manage your created lesson plans' : 'Manage all lesson plans'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* This would contain a table or list of lessons with edit/delete options */}
                {/* Adding a placeholder UI for now */}
                <div className="text-center py-10">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Management Interface</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Lesson plan management would be implemented here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default LessonPlansPage;
