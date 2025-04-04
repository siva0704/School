
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Edit, Trash, UserPlus, Eye, Mail, Phone } from 'lucide-react';
import { subjects } from '@/data/mock-data';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Create a schema for teacher form
const teacherFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contactNumber: z.string().min(10, { message: "Contact number must be valid." }),
  qualification: z.string().min(2, { message: "Please enter qualification." }),
  subjects: z.array(z.string()).min(1, { message: "Select at least one subject" }),
  classAssignments: z.array(
    z.object({
      classId: z.number(),
      section: z.string(),
      subjectId: z.string(),
    })
  ).optional(),
});

const TeachersPage = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [selectedClasses, setSelectedClasses] = useState<Array<{ classId: number, section: string, subjectId: string }>>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Array<{ id: string, name: string }>>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Get all subjects from different categories
  const allSubjects = [
    ...subjects.primary,
    ...subjects.middle,
    ...subjects.secondary
  ];

  // Initialize form
  const form = useForm<z.infer<typeof teacherFormSchema>>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      qualification: "",
      subjects: [],
    },
  });

  // Initialize edit form
  const editForm = useForm<z.infer<typeof teacherFormSchema>>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      qualification: "",
      subjects: [],
    },
  });

  // Load sample teachers data
  useEffect(() => {
    // Sample teachers data - in a real app, this would be fetched from an API
    const sampleTeachers = [
      { 
        id: '1', 
        name: 'Anjali Gupta', 
        email: 'anjali.gupta@vidyaerp.com',
        contactNumber: '9876543210',
        qualification: 'M.Sc. Mathematics',
        subjects: ['math-primary', 'math-middle'],
        subjectNames: ['Mathematics (Primary)', 'Mathematics (Middle)'],
        classes: [
          { classId: 5, section: 'A', subjectId: 'math-primary' },
          { classId: 6, section: 'B', subjectId: 'math-middle' },
        ],
        joiningDate: '2020-06-15'
      },
      { 
        id: '2', 
        name: 'Suresh Verma', 
        email: 'suresh.verma@vidyaerp.com',
        contactNumber: '9876543211',
        qualification: 'M.A. English Literature',
        subjects: ['english-primary', 'english-middle', 'english-secondary'],
        subjectNames: ['English (Primary)', 'English (Middle)', 'English (Secondary)'],
        classes: [
          { classId: 8, section: 'A', subjectId: 'english-middle' },
          { classId: 9, section: 'B', subjectId: 'english-secondary' },
          { classId: 10, section: 'A', subjectId: 'english-secondary' },
        ],
        joiningDate: '2018-04-10'
      },
      { 
        id: '3', 
        name: 'Meena Iyer', 
        email: 'meena.iyer@vidyaerp.com',
        contactNumber: '9876543212',
        qualification: 'M.Sc. Chemistry',
        subjects: ['science-middle', 'science-secondary'],
        subjectNames: ['Science (Middle)', 'Science (Secondary)'],
        classes: [
          { classId: 8, section: 'A', subjectId: 'science-middle' },
          { classId: 9, section: 'A', subjectId: 'science-secondary' },
          { classId: 10, section: 'B', subjectId: 'science-secondary' },
        ],
        joiningDate: '2019-07-22'
      },
    ];

    setTeachers(sampleTeachers);
  }, []);

  // Handle subject selection
  const handleSubjectSelect = (selectedSubjectIds: string[]) => {
    form.setValue("subjects", selectedSubjectIds);
    
    // Update available subjects for class assignments
    const filteredSubjects = allSubjects.filter(subject => 
      selectedSubjectIds.includes(subject.id)
    );
    setAvailableSubjects(filteredSubjects);
  };

  // Handle subject selection for edit
  const handleEditSubjectSelect = (selectedSubjectIds: string[]) => {
    editForm.setValue("subjects", selectedSubjectIds);
    
    // Update available subjects for class assignments
    const filteredSubjects = allSubjects.filter(subject => 
      selectedSubjectIds.includes(subject.id)
    );
    setAvailableSubjects(filteredSubjects);
  };

  // Add a class assignment
  const handleAddClass = (classId: number, section: string, subjectId: string) => {
    const newAssignment = { classId, section, subjectId };
    setSelectedClasses([...selectedClasses, newAssignment]);
  };

  // Remove a class assignment
  const handleRemoveClass = (index: number) => {
    const updatedClasses = [...selectedClasses];
    updatedClasses.splice(index, 1);
    setSelectedClasses(updatedClasses);
  };

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(
    teacher => 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjectNames.some((subject: string) => 
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleAddTeacher = (values: z.infer<typeof teacherFormSchema>) => {
    // Add class assignments to form values
    values.classAssignments = selectedClasses;
    
    // Generate subject names for display
    const subjectNames = values.subjects.map(subjectId => {
      const subject = allSubjects.find(s => s.id === subjectId);
      return subject ? subject.name : subjectId;
    });
    
    // Create new teacher object
    const newTeacher = {
      id: `${teachers.length + 1}`,
      name: values.name,
      email: values.email,
      contactNumber: values.contactNumber,
      qualification: values.qualification,
      subjects: values.subjects,
      subjectNames: subjectNames,
      classes: values.classAssignments,
      joiningDate: new Date().toISOString().split('T')[0]
    };
    
    // Add new teacher to the list
    setTeachers([...teachers, newTeacher]);
    
    // Show success toast
    toast({
      title: "Teacher Added",
      description: `${values.name} has been added successfully with ${values.subjects.length} subjects and ${selectedClasses.length} class assignments.`,
    });
    
    // Close dialog and reset form
    setIsAddDialogOpen(false);
    form.reset();
    setSelectedClasses([]);
    setAvailableSubjects([]);
  };

  const handleEditTeacher = (values: z.infer<typeof teacherFormSchema>) => {
    // Add class assignments to form values
    values.classAssignments = selectedClasses;
    
    // Generate subject names for display
    const subjectNames = values.subjects.map(subjectId => {
      const subject = allSubjects.find(s => s.id === subjectId);
      return subject ? subject.name : subjectId;
    });
    
    // Update teacher object
    const updatedTeachers = teachers.map(teacher => 
      teacher.id === selectedTeacher.id ? {
        ...teacher,
        name: values.name,
        email: values.email,
        contactNumber: values.contactNumber,
        qualification: values.qualification,
        subjects: values.subjects,
        subjectNames: subjectNames,
        classes: values.classAssignments,
      } : teacher
    );
    
    // Update teachers list
    setTeachers(updatedTeachers);
    
    // Show success toast
    toast({
      title: "Teacher Updated",
      description: `${values.name}'s profile has been updated successfully.`,
    });
    
    // Close dialog and reset
    setIsEditDialogOpen(false);
    editForm.reset();
    setSelectedClasses([]);
    setAvailableSubjects([]);
    setSelectedTeacher(null);
  };

  const handleDeleteTeacher = () => {
    // Remove teacher from the list
    const updatedTeachers = teachers.filter(teacher => teacher.id !== selectedTeacher.id);
    setTeachers(updatedTeachers);
    
    // Show success toast
    toast({
      title: "Teacher Deleted",
      description: `${selectedTeacher.name}'s profile has been removed successfully.`,
    });
    
    // Close dialog and reset
    setIsDeleteDialogOpen(false);
    setSelectedTeacher(null);
  };

  const openViewTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsViewDialogOpen(true);
  };

  const openEditTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    editForm.reset({
      name: teacher.name,
      email: teacher.email,
      contactNumber: teacher.contactNumber,
      qualification: teacher.qualification,
      subjects: teacher.subjects,
    });
    setSelectedClasses(teacher.classes || []);
    
    // Update available subjects for class assignments
    const filteredSubjects = allSubjects.filter(subject => 
      teacher.subjects.includes(subject.id)
    );
    setAvailableSubjects(filteredSubjects);
    
    setIsEditDialogOpen(true);
  };

  const openDeleteTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  // Only admin can access this page
  if (role !== 'admin') {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">Teachers</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Teacher</DialogTitle>
              <DialogDescription>
                Create a new teacher profile with subject specializations and class assignments.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddTeacher)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter qualification" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <FormLabel>Subject Specializations</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {allSubjects.map((subject) => (
                          <div key={subject.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={subject.id} 
                              onCheckedChange={(checked) => {
                                const currentSubjects = form.getValues("subjects") || [];
                                if (checked) {
                                  handleSubjectSelect([...currentSubjects, subject.id]);
                                } else {
                                  handleSubjectSelect(
                                    currentSubjects.filter(id => id !== subject.id)
                                  );
                                }
                              }} 
                            />
                            <label htmlFor={subject.id} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {subject.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Class Assignments</h4>
                  {availableSubjects.length > 0 ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <Select onValueChange={(val) => form.setValue("classAssignments.0.classId", parseInt(val))}>
                          <FormLabel>Class</FormLabel>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(classNum => (
                              <SelectItem key={classNum} value={String(classNum)}>
                                Class {classNum}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select onValueChange={(val) => form.setValue("classAssignments.0.section", val)}>
                          <FormLabel>Section</FormLabel>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            {['A', 'B', 'C'].map(section => (
                              <SelectItem key={section} value={section}>
                                Section {section}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select onValueChange={(val) => form.setValue("classAssignments.0.subjectId", val)}>
                          <FormLabel>Subject</FormLabel>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSubjects.map(subject => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const classId = form.getValues("classAssignments.0.classId");
                          const section = form.getValues("classAssignments.0.section");
                          const subjectId = form.getValues("classAssignments.0.subjectId");
                          
                          if (classId && section && subjectId) {
                            handleAddClass(classId, section, subjectId);
                          }
                        }}
                      >
                        Add Class
                      </Button>
                      
                      {selectedClasses.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-2">Selected Classes:</h5>
                          <div className="space-y-2">
                            {selectedClasses.map((cls, index) => {
                              const subjectName = allSubjects.find(s => s.id === cls.subjectId)?.name || '';
                              return (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <span>Class {cls.classId}-{cls.section}: {subjectName}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleRemoveClass(index)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Please select at least one subject specialization first
                    </p>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Teacher</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Teachers</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search teachers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.subjectNames.join(', ')}</TableCell>
                    <TableCell>
                      {teacher.classes.map((cls: any) => `${cls.classId}-${cls.section}`).join(', ')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openViewTeacher(teacher)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openEditTeacher(teacher)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openDeleteTeacher(teacher)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No teachers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Teacher Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
            <DialogDescription>
              View complete information about this teacher.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeacher && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-3 mb-4">
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-semibold text-gray-600">
                  {selectedTeacher.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold">{selectedTeacher.name}</h3>
                <p className="text-sm text-gray-500">{selectedTeacher.qualification}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedTeacher.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedTeacher.contactNumber}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Joined on</p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedTeacher.joiningDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Subject Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.subjectNames.map((subject: string, index: number) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Class Assignments</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedTeacher.classes.map((cls: any, index: number) => {
                    const subjectName = allSubjects.find(s => s.id === cls.subjectId)?.name || cls.subjectId;
                    return (
                      <div key={index} className="border rounded p-2 text-sm">
                        <p className="font-medium">Class {cls.classId}-{cls.section}</p>
                        <p className="text-xs text-gray-500">{subjectName}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  openEditTeacher(selectedTeacher);
                }}>
                  Edit Profile
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update teacher profile information.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeacher && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditTeacher)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter qualification" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <FormLabel>Subject Specializations</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {allSubjects.map((subject) => (
                          <div key={subject.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`edit-${subject.id}`}
                              checked={editForm.getValues("subjects")?.includes(subject.id)}
                              onCheckedChange={(checked) => {
                                const currentSubjects = editForm.getValues("subjects") || [];
                                if (checked) {
                                  handleEditSubjectSelect([...currentSubjects, subject.id]);
                                } else {
                                  handleEditSubjectSelect(
                                    currentSubjects.filter(id => id !== subject.id)
                                  );
                                }
                              }} 
                            />
                            <label htmlFor={`edit-${subject.id}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {subject.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Class Assignments</h4>
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedClasses([])}
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  {availableSubjects.length > 0 ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <Select onValueChange={(val) => editForm.setValue("classAssignments.0.classId", parseInt(val))}>
                          <FormLabel>Class</FormLabel>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(classNum => (
                              <SelectItem key={classNum} value={String(classNum)}>
                                Class {classNum}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select onValueChange={(val) => editForm.setValue("classAssignments.0.section", val)}>
                          <FormLabel>Section</FormLabel>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            {['A', 'B', 'C'].map(section => (
                              <SelectItem key={section} value={section}>
                                Section {section}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select onValueChange={(val) => editForm.setValue("classAssignments.0.subjectId", val)}>
                          <FormLabel>Subject</FormLabel>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSubjects.map(subject => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const classId = editForm.getValues("classAssignments.0.classId");
                          const section = editForm.getValues("classAssignments.0.section");
                          const subjectId = editForm.getValues("classAssignments.0.subjectId");
                          
                          if (classId && section && subjectId) {
                            handleAddClass(classId, section, subjectId);
                          }
                        }}
                      >
                        Add Class
                      </Button>
                      
                      {selectedClasses.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-2">Selected Classes:</h5>
                          <div className="space-y-2">
                            {selectedClasses.map((cls, index) => {
                              const subjectName = allSubjects.find(s => s.id === cls.subjectId)?.name || '';
                              return (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <span>Class {cls.classId}-{cls.section}: {subjectName}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleRemoveClass(index)}
                                    type="button"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Please select at least one subject specialization first
                    </p>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Teacher</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the teacher profile
              {selectedTeacher && ` for ${selectedTeacher.name}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeacher} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeachersPage;
