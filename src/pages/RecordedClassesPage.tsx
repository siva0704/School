import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  FileVideo,
  Search,
  Upload,
  Trash2,
  Play,
  Download,
  Pencil,
  X,
  Filter,
} from 'lucide-react';
import { RecordedClass } from '@/types';
import { format } from 'date-fns';

const RecordedClassesPage = () => {
  const { role, user, teacherAssignments } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("browse");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recordedDate, setRecordedDate] = useState<Date>(new Date());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [recordedClasses, setRecordedClasses] = useState<RecordedClass[]>([
    {
      id: '1',
      title: 'Photosynthesis Process',
      description: 'Detailed explanation of the photosynthesis process in plants',
      classId: 'class10',
      section: 'A',
      subjectId: 'biology',
      teacherId: 'teacher1',
      dateRecorded: '2023-09-10',
      recordedDate: '2023-09-10',
      duration: '45:20',
      videoUrl: 'https://example.com/videos/photosynthesis.mp4',
      thumbnailUrl: '/path/to/thumbnail1.jpg',
      createdAt: '2023-09-11T10:00:00Z',
    },
    {
      id: '2',
      title: 'Quadratic Equations',
      description: 'Solving different types of quadratic equations with examples',
      classId: 'class9',
      section: 'B',
      subjectId: 'math',
      teacherId: 'teacher2',
      dateRecorded: '2023-09-08',
      recordedDate: '2023-09-08',
      duration: '50:15',
      videoUrl: 'https://example.com/videos/quadratic.mp4',
      thumbnailUrl: '/path/to/thumbnail2.jpg',
      createdAt: '2023-09-09T14:30:00Z',
    },
    {
      id: '3',
      title: 'Shakespearean Literature',
      description: 'Introduction to Shakespeare and his famous works',
      classId: 'class12',
      section: 'A',
      subjectId: 'english',
      teacherId: 'teacher3',
      dateRecorded: '2023-09-05',
      recordedDate: '2023-09-05',
      duration: '55:10',
      videoUrl: 'https://example.com/videos/shakespeare.mp4',
      thumbnailUrl: '/path/to/thumbnail3.jpg',
      createdAt: '2023-09-06T09:15:00Z',
    },
    {
      id: '4',
      title: 'Chemical Bonding',
      description: 'Different types of chemical bonds and their properties',
      classId: 'class11',
      section: 'C',
      subjectId: 'chemistry',
      teacherId: 'teacher1',
      dateRecorded: '2023-09-03',
      recordedDate: '2023-09-03',
      duration: '48:30',
      videoUrl: 'https://example.com/videos/chemical-bonding.mp4',
      thumbnailUrl: '/path/to/thumbnail4.jpg',
      createdAt: '2023-09-04T11:45:00Z',
    },
    {
      id: '5',
      title: 'Laws of Motion',
      description: 'Newton\'s laws of motion with practical examples',
      classId: 'class10',
      section: 'B',
      subjectId: 'physics',
      teacherId: 'teacher4',
      dateRecorded: '2023-09-01',
      recordedDate: '2023-09-01',
      duration: '52:40',
      videoUrl: 'https://example.com/videos/laws-motion.mp4',
      thumbnailUrl: '/path/to/thumbnail5.jpg',
      createdAt: '2023-09-02T13:20:00Z',
    },
    {
      id: '6',
      title: 'India\'s Freedom Struggle',
      description: 'Key events and figures in India\'s independence movement',
      classId: 'class9',
      section: 'A',
      subjectId: 'history',
      teacherId: 'teacher5',
      dateRecorded: '2023-08-30',
      recordedDate: '2023-08-30',
      duration: '58:15',
      videoUrl: 'https://example.com/videos/freedom-struggle.mp4',
      thumbnailUrl: '/path/to/thumbnail6.jpg',
      createdAt: '2023-08-31T10:10:00Z',
    },
  ]);

  const mockClasses = [
    { id: 'class9', name: '9' },
    { id: 'class10', name: '10' },
    { id: 'class11', name: '11' },
    { id: 'class12', name: '12' },
  ];

  const mockSections = ['A', 'B', 'C'];

  const mockSubjects = [
    { id: 'math', name: 'Mathematics', code: 'MATH', classesApplicable: [9, 10, 11, 12] },
    { id: 'science', name: 'Science', code: 'SCI', classesApplicable: [9, 10] },
    { id: 'physics', name: 'Physics', code: 'PHY', classesApplicable: [11, 12] },
    { id: 'chemistry', name: 'Chemistry', code: 'CHEM', classesApplicable: [11, 12] },
    { id: 'biology', name: 'Biology', code: 'BIO', classesApplicable: [11, 12] },
    { id: 'history', name: 'History', code: 'HIST', classesApplicable: [9, 10, 11, 12] },
    { id: 'geography', name: 'Geography', code: 'GEO', classesApplicable: [9, 10, 11, 12] },
    { id: 'english', name: 'English', code: 'ENG', classesApplicable: [9, 10, 11, 12] },
    { id: 'hindi', name: 'Hindi', code: 'HIN', classesApplicable: [9, 10, 11, 12] },
  ];

  const getClassOptions = () => {
    if (role === 'teacher' && teacherAssignments) {
      const assignedClassIds = [...new Set(teacherAssignments.map(a => a.classId))];
      return mockClasses.filter(c => {
        const classIdNumber = parseInt(c.id.replace('class', ''));
        return assignedClassIds.includes(classIdNumber);
      });
    }
    return mockClasses;
  };

  const getSectionOptions = () => {
    if (!selectedClass) return [];
    
    if (role === 'teacher' && teacherAssignments) {
      const classId = parseInt(selectedClass.replace('class', ''));
      const assignedSections = [...new Set(
        teacherAssignments
          .filter(a => a.classId === classId)
          .map(a => a.section)
      )];
      return mockSections.filter(s => assignedSections.includes(s));
    }
    return mockSections;
  };

  const getSubjectOptions = () => {
    if (!selectedClass) return [];
    
    const classId = parseInt(selectedClass.replace('class', ''));
    let filteredSubjects = mockSubjects.filter(s => s.classesApplicable.includes(classId));
    
    if (role === 'teacher' && teacherAssignments && selectedSection) {
      const assignedSubjectIds = teacherAssignments
        .filter(a => a.classId === classId && a.section === selectedSection)
        .map(a => a.subjectId);
      
      filteredSubjects = filteredSubjects.filter(s => assignedSubjectIds.includes(s.id));
    }
    
    return filteredSubjects;
  };

  const resetForm = () => {
    setSelectedClass('');
    setSelectedSection('');
    setSelectedSubject('');
    setTitle('');
    setDescription('');
    setRecordedDate(new Date());
    setSelectedFile(null);
    setIsEditing(false);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select a video file.",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedClass || !selectedSection || !selectedSubject || !title) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all required fields.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!isEditing && !selectedFile) {
      toast({
        variant: "destructive",
        title: "File Required",
        description: "Please select a video file to upload.",
      });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      try {
        if (isEditing && editingId) {
          const updatedClasses = recordedClasses.map(rc => {
            if (rc.id === editingId) {
              return {
                ...rc,
                title,
                description,
                classId: selectedClass,
                section: selectedSection,
                subjectId: selectedSubject,
                recordedDate: format(recordedDate, 'yyyy-MM-dd'),
                dateRecorded: format(recordedDate, 'yyyy-MM-dd'),
              };
            }
            return rc;
          });
          setRecordedClasses(updatedClasses);
          toast({
            title: "Success",
            description: "Recorded class updated successfully.",
          });
        } else {
          const newClass: RecordedClass = {
            id: Date.now().toString(),
            title,
            description,
            classId: selectedClass,
            section: selectedSection,
            subjectId: selectedSubject,
            teacherId: user?.id || 'unknown',
            recordedDate: format(recordedDate, 'yyyy-MM-dd'),
            dateRecorded: format(recordedDate, 'yyyy-MM-dd'),
            duration: '00:00',
            videoUrl: selectedFile ? URL.createObjectURL(selectedFile) : '',
            thumbnailUrl: '/path/to/default-thumbnail.jpg',
            createdAt: new Date().toISOString(),
          };
          setRecordedClasses([newClass, ...recordedClasses]);
          toast({
            title: "Success",
            description: "Recorded class uploaded successfully.",
          });
        }

        resetForm();
        setActiveTab("browse");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const handleEdit = (id: string) => {
    const classToEdit = recordedClasses.find(rc => rc.id === id);
    if (classToEdit) {
      setIsEditing(true);
      setEditingId(id);
      setSelectedClass(classToEdit.classId);
      setSelectedSection(classToEdit.section);
      setSelectedSubject(classToEdit.subjectId);
      setTitle(classToEdit.title);
      setDescription(classToEdit.description);
      setRecordedDate(new Date(classToEdit.recordedDate));
      setActiveTab("upload");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updatedClasses = recordedClasses.filter(rc => rc.id !== deleteId);
      setRecordedClasses(updatedClasses);
      toast({
        title: "Deleted",
        description: "Recorded class has been deleted.",
      });
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const getSubjectName = (subjectId: string) => {
    return mockSubjects.find(s => s.id === subjectId)?.name || 'Unknown Subject';
  };

  const getFilteredClasses = () => {
    let filtered = [...recordedClasses];
    
    if (filter) {
      const searchTerm = filter.toLowerCase();
      filtered = filtered.filter(rc => 
        rc.title.toLowerCase().includes(searchTerm) ||
        rc.description.toLowerCase().includes(searchTerm) ||
        getSubjectName(rc.subjectId).toLowerCase().includes(searchTerm)
      );
    }
    
    if (role === 'teacher' && user) {
      filtered = filtered.filter(rc => rc.teacherId === user.id);
    } else if (role === 'student' && user) {
      const student = user as any;
      const classIdString = `class${student.class}`;
      filtered = filtered.filter(rc => 
        rc.classId === classIdString && rc.section === student.section
      );
    }
    
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return filtered;
  };

  const paginatedClasses = () => {
    const filtered = getFilteredClasses();
    const startIndex = (page - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  };

  const totalPages = Math.ceil(getFilteredClasses().length / pageSize);

  const handlePreview = (videoUrl: string) => {
    setVideoPreviewUrl(videoUrl);
    setIsPreviewOpen(true);
  };

  const getAssignmentValidation = () => {
    if (role !== 'teacher' || !teacherAssignments || !selectedClass || !selectedSection || !selectedSubject) {
      return true;
    }

    const classId = parseInt(selectedClass.replace('class', ''));
    return teacherAssignments.some(
      a => a.classId === classId && 
           a.section === selectedSection && 
           a.subjectId === selectedSubject
    );
  };

  const assignmentValidation = getAssignmentValidation();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recorded Classes</h1>
        
        {role === 'teacher' && (
          <Button 
            onClick={() => {
              resetForm();
              setActiveTab(activeTab === "upload" ? "browse" : "upload");
            }}
          >
            {activeTab === "upload" ? "Browse Classes" : "Upload New Class"}
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="browse">Browse Classes</TabsTrigger>
          {role === 'teacher' && (
            <TabsTrigger value="upload">Upload Class</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="browse" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div>
                  <CardTitle>Recorded Classes Library</CardTitle>
                  <CardDescription>Browse and watch recorded classes</CardDescription>
                </div>
                
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search classes..."
                    className="pl-8"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {paginatedClasses().length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Class & Section</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedClasses().map((recordedClass) => (
                        <TableRow key={recordedClass.id}>
                          <TableCell className="font-medium">{recordedClass.title}</TableCell>
                          <TableCell>Class {recordedClass.classId.replace('class', '')} - {recordedClass.section}</TableCell>
                          <TableCell>{getSubjectName(recordedClass.subjectId)}</TableCell>
                          <TableCell>{new Date(recordedClass.recordedDate).toLocaleDateString()}</TableCell>
                          <TableCell>{recordedClass.duration}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePreview(recordedClass.videoUrl)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {role === 'teacher' && recordedClass.teacherId === user?.id && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEdit(recordedClass.id)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDelete(recordedClass.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileVideo className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No recorded classes found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {filter 
                      ? "No results match your search criteria" 
                      : role === 'teacher' 
                        ? "You haven't uploaded any recorded classes yet" 
                        : "No recorded classes available for your class"
                    }
                  </p>
                </div>
              )}
            </CardContent>
            {totalPages > 1 && (
              <CardFooter>
                <Pagination className="w-full">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(prev => Math.max(prev - 1, 1));
                        }}
                        aria-disabled={page === 1}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          href="#"
                          isActive={page === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(prev => Math.min(prev + 1, totalPages));
                        }}
                        aria-disabled={page === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        {role === 'teacher' && (
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit Recorded Class' : 'Upload Recorded Class'}</CardTitle>
                <CardDescription>
                  {isEditing 
                    ? 'Modify the details of the recorded class'
                    : 'Share recorded class videos with your students'}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select 
                          value={selectedClass} 
                          onValueChange={setSelectedClass}
                        >
                          <SelectTrigger id="class">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent>
                            {getClassOptions().map((classItem) => (
                              <SelectItem key={classItem.id} value={classItem.id}>
                                Class {classItem.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="section">Section</Label>
                        <Select 
                          value={selectedSection} 
                          onValueChange={setSelectedSection}
                          disabled={!selectedClass}
                        >
                          <SelectTrigger id="section">
                            <SelectValue placeholder="Select Section" />
                          </SelectTrigger>
                          <SelectContent>
                            {getSectionOptions().map((section) => (
                              <SelectItem key={section} value={section}>
                                Section {section}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select 
                          value={selectedSubject} 
                          onValueChange={setSelectedSubject}
                          disabled={!selectedClass}
                        >
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select Subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {getSubjectOptions().map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {!assignmentValidation && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800">
                        <div className="flex items-center">
                          <Filter className="h-5 w-5 mr-2" />
                          <p><strong>Note:</strong> You can only upload videos for classes, sections, and subjects assigned to you.</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        placeholder="Enter title for the recorded class"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Enter a description of the class content"
                        className="min-h-[100px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Recording Date</Label>
                      <div className="border rounded-md p-4">
                        <Calendar
                          mode="single"
                          selected={recordedDate}
                          onSelect={(date) => date && setRecordedDate(date)}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="video">Video File</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <input
                          id="video"
                          type="file"
                          accept="video/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {selectedFile ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center text-sm">
                              <FileVideo className="h-5 w-5 mr-2 text-blue-500" />
                              <span className="font-medium">{selectedFile.name}</span>
                              <span className="ml-2 text-gray-500">
                                ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <div className="flex justify-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedFile(null);
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                  }
                                }}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Clear
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Change
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer py-8"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-10 w-10 mx-auto text-gray-400" />
                            <p className="mt-2 text-sm font-medium text-gray-900">
                              Click to upload or drag and drop
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              MP4, WebM, or other video formats (max. 500MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      if (isEditing) {
                        setActiveTab("browse");
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !assignmentValidation}
                  >
                    {isSubmitting ? 'Processing...' : isEditing ? 'Update' : 'Upload'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] h-[500px]">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
            <DialogDescription>
              Watching recorded class video
            </DialogDescription>
          </DialogHeader>
          {videoPreviewUrl && (
            <div className="w-full h-[350px] bg-black">
              <video
                src={videoPreviewUrl}
                controls
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recorded class? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecordedClassesPage;
