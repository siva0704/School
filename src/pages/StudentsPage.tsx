
import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCaption,
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
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Edit, Trash, FileText } from 'lucide-react';

const StudentsPage = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Sample students data
  const students = [
    {
      id: '1',
      name: 'Rahul Sharma',
      registrationNumber: 'REG2023001',
      class: 5,
      section: 'A',
      rollNumber: '01',
      parentName: 'Sunil Sharma',
      parentContact: '9876543210',
      dateOfBirth: '2013-05-15',
      address: '123 Park Street, Mumbai'
    },
    {
      id: '2',
      name: 'Priya Patel',
      registrationNumber: 'REG2023002',
      class: 5,
      section: 'B',
      rollNumber: '02',
      parentName: 'Rajesh Patel',
      parentContact: '9876543211',
      dateOfBirth: '2013-07-22',
      address: '456 Lake View, Mumbai'
    },
    {
      id: '3',
      name: 'Amit Kumar',
      registrationNumber: 'REG2023003',
      class: 6,
      section: 'A',
      rollNumber: '01',
      parentName: 'Vikram Kumar',
      parentContact: '9876543212',
      dateOfBirth: '2012-03-10',
      address: '789 Hill Road, Mumbai'
    },
    {
      id: '4',
      name: 'Nisha Singh',
      registrationNumber: 'REG2023004',
      class: 6,
      section: 'B',
      rollNumber: '02',
      parentName: 'Rajeev Singh',
      parentContact: '9876543213',
      dateOfBirth: '2012-09-18',
      address: '101 Sea View, Mumbai'
    },
  ];

  // Filter students based on search term and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === 'all' || student.class === parseInt(classFilter);
    const matchesSection = sectionFilter === 'all' || student.section === sectionFilter;
    
    return matchesSearch && matchesClass && matchesSection;
  });

  const handleAddStudent = () => {
    toast({
      title: "Student Added",
      description: "Student has been added successfully.",
    });
    setIsAddDialogOpen(false);
  };

  // Only admin and teachers can access this page
  if (role !== 'admin' && role !== 'teacher') {
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
        <h2 className="text-3xl font-bold">Students</h2>
        
        {role === 'admin' && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Student</DialogTitle>
                <DialogDescription>
                  Create a new student profile. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm">
                      Name
                    </label>
                    <Input id="name" placeholder="Enter name" />
                  </div>
                  <div>
                    <label htmlFor="regNumber" className="block mb-2 text-sm">
                      Registration Number
                    </label>
                    <Input id="regNumber" placeholder="Registration number" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="class" className="block mb-2 text-sm">
                      Class
                    </label>
                    <Select>
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
                  </div>
                  <div>
                    <label htmlFor="section" className="block mb-2 text-sm">
                      Section
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A', 'B', 'C', 'D'].map(section => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="rollNumber" className="block mb-2 text-sm">
                      Roll Number
                    </label>
                    <Input id="rollNumber" placeholder="Roll number" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="parentName" className="block mb-2 text-sm">
                      Parent Name
                    </label>
                    <Input id="parentName" placeholder="Parent name" />
                  </div>
                  <div>
                    <label htmlFor="parentContact" className="block mb-2 text-sm">
                      Parent Contact
                    </label>
                    <Input id="parentContact" placeholder="Contact number" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block mb-2 text-sm">
                    Address
                  </label>
                  <Input id="address" placeholder="Full address" />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Student Directory</CardTitle>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-40">
                <Select 
                  value={classFilter} 
                  onValueChange={setClassFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(classNum => (
                      <SelectItem key={classNum} value={String(classNum)}>
                        Class {classNum}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative w-full md:w-40">
                <Select 
                  value={sectionFilter} 
                  onValueChange={setSectionFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {['A', 'B', 'C', 'D'].map(section => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.registrationNumber}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      {student.class}-{student.section}
                    </TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.parentName}</TableCell>
                    <TableCell>{student.parentContact}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        {role === 'admin' && (
                          <>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;
