
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/components/ui/use-toast';
import { Plus, Users, BookOpen, Edit, Trash } from 'lucide-react';
import { ClassData, Subject } from '@/types';
import ClassFormDialog from '@/components/ClassFormDialog';
import SubjectFormDialog from '@/components/SubjectFormDialog';
import ConfirmDialog from '@/components/ConfirmDialog';

const ClassesPage = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('classes');
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([
    { id: '1', name: '1', sections: [{ id: '1A', name: 'A' }, { id: '1B', name: 'B' }] },
    { id: '2', name: '2', sections: [{ id: '2A', name: 'A' }, { id: '2B', name: 'B' }] },
    { id: '3', name: '3', sections: [{ id: '3A', name: 'A' }, { id: '3B', name: 'B' }, { id: '3C', name: 'C' }] },
    { id: '4', name: '4', sections: [{ id: '4A', name: 'A' }, { id: '4B', name: 'B' }] },
    { id: '5', name: '5', sections: [{ id: '5A', name: 'A' }, { id: '5B', name: 'B' }, { id: '5C', name: 'C' }] },
    { id: '6', name: '6', sections: [{ id: '6A', name: 'A' }, { id: '6B', name: 'B' }] },
    { id: '7', name: '7', sections: [{ id: '7A', name: 'A' }, { id: '7B', name: 'B' }] },
    { id: '8', name: '8', sections: [{ id: '8A', name: 'A' }, { id: '8B', name: 'B' }] },
    { id: '9', name: '9', sections: [{ id: '9A', name: 'A' }, { id: '9B', name: 'B' }] },
    { id: '10', name: '10', sections: [{ id: '10A', name: 'A' }, { id: '10B', name: 'B' }] },
  ]);
  
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'English', code: 'ENG', classesApplicable: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: '2', name: 'Hindi', code: 'HIN', classesApplicable: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: '3', name: 'Mathematics', code: 'MAT', classesApplicable: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: '4', name: 'EVS', code: 'EVS', classesApplicable: [1, 2, 3, 4, 5] },
    { id: '5', name: 'GK', code: 'GK', classesApplicable: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: '6', name: 'Computer', code: 'COMP', classesApplicable: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: '7', name: 'Science', code: 'SCI', classesApplicable: [6, 7, 8, 9, 10] },
    { id: '8', name: 'Social Science', code: 'SOC', classesApplicable: [6, 7, 8, 9, 10] },
    { id: '9', name: 'Physics', code: 'PHY', classesApplicable: [9, 10] },
    { id: '10', name: 'Chemistry', code: 'CHE', classesApplicable: [9, 10] },
    { id: '11', name: 'Biology', code: 'BIO', classesApplicable: [9, 10] },
  ]);
  
  // State for editing
  const [editingClass, setEditingClass] = useState<ClassData | undefined>(undefined);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);
  
  // State for deletion confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'class' | 'subject', id: string } | null>(null);

  const handleAddClass = (classData: Omit<ClassData, 'id'>) => {
    const newClass: ClassData = {
      id: `class-${Date.now()}`,
      ...classData,
    };
    
    setClasses(prev => [...prev, newClass]);
    
    toast({
      title: "Class Added",
      description: `Class ${classData.name} has been added successfully.`,
    });
  };

  const handleEditClass = (classData: Omit<ClassData, 'id'>) => {
    if (!editingClass) return;
    
    setClasses(prev => prev.map(cls => 
      cls.id === editingClass.id 
        ? { ...cls, name: classData.name, sections: classData.sections }
        : cls
    ));
    
    setEditingClass(undefined);
    
    toast({
      title: "Class Updated",
      description: `Class ${classData.name} has been updated successfully.`,
    });
  };

  const handleDeleteClass = (classId: string) => {
    setItemToDelete({ type: 'class', id: classId });
    setDeleteConfirmOpen(true);
  };

  const handleAddSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      id: `subject-${Date.now()}`,
      ...subjectData,
    };
    
    setSubjects(prev => [...prev, newSubject]);
    
    toast({
      title: "Subject Added",
      description: `${subjectData.name} has been added successfully.`,
    });
  };

  const handleEditSubject = (subjectData: Omit<Subject, 'id'>) => {
    if (!editingSubject) return;
    
    setSubjects(prev => prev.map(sub => 
      sub.id === editingSubject.id 
        ? { ...sub, ...subjectData }
        : sub
    ));
    
    setEditingSubject(undefined);
    
    toast({
      title: "Subject Updated",
      description: `${subjectData.name} has been updated successfully.`,
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    setItemToDelete({ type: 'subject', id: subjectId });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'class') {
      const classToDelete = classes.find(c => c.id === itemToDelete.id);
      setClasses(prev => prev.filter(c => c.id !== itemToDelete.id));
      
      toast({
        title: "Class Deleted",
        description: `Class ${classToDelete?.name} has been deleted successfully.`,
      });
    } else {
      const subjectToDelete = subjects.find(s => s.id === itemToDelete.id);
      setSubjects(prev => prev.filter(s => s.id !== itemToDelete.id));
      
      toast({
        title: "Subject Deleted",
        description: `${subjectToDelete?.name} has been deleted successfully.`,
      });
    }
    
    setItemToDelete(null);
    setDeleteConfirmOpen(false);
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
      <h2 className="text-3xl font-bold">Academic Structure</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="classes">Classes & Sections</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classes" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Classes and Sections</h3>
            
            <Button onClick={() => setIsAddClassDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <Card key={cls.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Class {cls.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setEditingClass(cls);
                          setIsAddClassDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClass(cls.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {cls.sections.length} Sections: {cls.sections.map(s => s.name).join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <span>{Math.floor(Math.random() * 40) + 20} Students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-gray-500" />
                      <span>{subjects.filter(s => s.classesApplicable.includes(parseInt(cls.name))).length} Subjects</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Subjects</h3>
            
            <Button onClick={() => setIsAddSubjectDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Applicable Classes</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>
                        {subject.classesApplicable.length > 5
                          ? `Classes ${subject.classesApplicable[0]}-${
                              subject.classesApplicable[subject.classesApplicable.length - 1]
                            }`
                          : `Classes ${subject.classesApplicable.join(', ')}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setEditingSubject(subject);
                              setIsAddSubjectDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDeleteSubject(subject.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Class Form Dialog */}
      <ClassFormDialog
        open={isAddClassDialogOpen}
        onOpenChange={setIsAddClassDialogOpen}
        onSave={editingClass ? handleEditClass : handleAddClass}
        editClass={editingClass}
      />

      {/* Subject Form Dialog */}
      <SubjectFormDialog
        open={isAddSubjectDialogOpen}
        onOpenChange={(open) => {
          setIsAddSubjectDialogOpen(open);
          if (!open) setEditingSubject(undefined);
        }}
        onSave={editingSubject ? handleEditSubject : handleAddSubject}
        editSubject={editingSubject}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={`Delete ${itemToDelete?.type === 'class' ? 'Class' : 'Subject'}`}
        description={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ClassesPage;
