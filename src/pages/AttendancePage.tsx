import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { PlusCircle, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AttendanceForm from '@/components/attendance/AttendanceForm';
import AttendanceRecordsView from '@/components/attendance/AttendanceRecordsView';
import StudentAttendanceView from '@/components/attendance/StudentAttendanceView';
import { ClassData, Section, Student, Subject, AttendanceRecord } from '@/types';
import { classes, students, subjects, attendanceRecords } from '@/data/mock-data';

const AttendancePage = () => {
  const { role, user, teacherAssignments } = useAuth();
  const { toast } = useToast();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("mark");
  
  // Attendance form state
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendingStudents, setAttendingStudents] = useState<Record<string, boolean>>({});
  
  // Records view state
  const [selectedViewClass, setSelectedViewClass] = useState('');
  const [selectedViewSection, setSelectedViewSection] = useState('');
  const [selectedViewSubject, setSelectedViewSubject] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  // Filtered data based on role
  const [classOptions, setClassOptions] = useState<ClassData[]>([]);
  const [sectionOptions, setSectionOptions] = useState<string[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);

  // Check if teacher is assigned to current selection
  const [isAssignedToSelection, setIsAssignedToSelection] = useState(true);

  // Console log the teacher assignments for debugging
  useEffect(() => {
    if (teacherAssignments) {
      console.info('Teacher assignments loaded:', teacherAssignments);
    }
  }, [teacherAssignments]);
  
  // Effect for loading classes based on role
  useEffect(() => {
    if (role === 'admin') {
      // Admin can see all classes
      setClassOptions(classes);
    } else if (role === 'teacher' && teacherAssignments) {
      // Teacher can only see assigned classes
      const assignedClassIds = teacherAssignments.map(assignment => assignment.classId);
      const uniqueClassIds = [...new Set(assignedClassIds)];
      
      const teacherClasses = classes.filter(classData => 
        uniqueClassIds.includes(parseInt(classData.name))
      );
      
      console.info('Filtered classes for teacher:', teacherClasses);
      setClassOptions(teacherClasses);
    } else if (role === 'student' && user) {
      // Student can only see their own class
      const studentUser = user as Student;
      const studentClass = classes.find(c => 
        parseInt(c.name) === studentUser.class
      );
      
      if (studentClass) {
        setClassOptions([studentClass]);
        setSelectedClass(studentClass.id);
        setSelectedViewClass(studentClass.id);
      }
    }
  }, [role, user, teacherAssignments]);
  
  // Effect for loading sections based on selected class
  useEffect(() => {
    if (!selectedClass) {
      setSectionOptions([]);
      return;
    }
    
    const selectedClassData = classes.find(c => c.id === selectedClass);
    
    if (!selectedClassData) {
      setSectionOptions([]);
      return;
    }
    
    if (role === 'teacher' && teacherAssignments) {
      // Filter sections based on teacher assignments
      const assignedSections = teacherAssignments
        .filter(assignment => assignment.classId === parseInt(selectedClassData.name))
        .map(assignment => assignment.section);
      
      const uniqueSections = [...new Set(assignedSections)];
      setSectionOptions(uniqueSections);
    } else if (role === 'student' && user) {
      // Student can only see their own section
      const studentUser = user as Student;
      setSectionOptions([studentUser.section]);
      setSelectedSection(studentUser.section);
      setSelectedViewSection(studentUser.section);
    } else {
      // Admin can see all sections
      setSectionOptions(selectedClassData.sections.map(section => section.name));
    }
  }, [selectedClass, role, user, teacherAssignments]);
  
  // Effect for loading subjects based on selected class
  useEffect(() => {
    if (!selectedClass) {
      setSubjectOptions([]);
      return;
    }
    
    const classData = classes.find(c => c.id === selectedClass);
    if (!classData) return;
    
    const classId = parseInt(classData.name);
    
    if (role === 'teacher' && teacherAssignments) {
      // Filter subjects based on teacher assignments
      const assignedSubjectIds = teacherAssignments
        .filter(assignment => 
          assignment.classId === classId &&
          (!selectedSection || assignment.section === selectedSection)
        )
        .map(assignment => assignment.subjectId);
      
      const uniqueSubjectIds = [...new Set(assignedSubjectIds)];
      
      // Find all subjects that match the IDs and are applicable for this class
      const allSubjectsFlat: Subject[] = [];
      
      // Flatten all subject groups
      for (const groupKey in subjects) {
        const subjectList = subjects[groupKey as keyof typeof subjects] || [];
        allSubjectsFlat.push(...subjectList);
      }
      
      const teacherSubjects = allSubjectsFlat.filter(subject => 
        uniqueSubjectIds.includes(subject.id) && 
        subject.classesApplicable.includes(classId)
      );
      
      setSubjectOptions(teacherSubjects);
    } else {
      // Admin or student can see all subjects for the class
      const allSubjectsFlat: Subject[] = [];
      
      // Flatten all subject groups
      for (const groupKey in subjects) {
        const subjectList = subjects[groupKey as keyof typeof subjects] || [];
        allSubjectsFlat.push(...subjectList);
      }
      
      const classSubjects = allSubjectsFlat.filter(subject => 
        subject.classesApplicable.includes(classId)
      );
      
      setSubjectOptions(classSubjects);
    }
  }, [selectedClass, selectedSection, role, teacherAssignments]);
  
  // Effect for loading students based on selected class and section
  useEffect(() => {
    if (!selectedClass || !selectedSection) {
      setStudentOptions([]);
      setAttendingStudents({});
      return;
    }
    
    const classData = classes.find(c => c.id === selectedClass);
    if (!classData) return;
    
    const classId = parseInt(classData.name);
    
    const filteredStudents = students.filter(student => 
      student.class === classId && student.section === selectedSection
    );
    
    setStudentOptions(filteredStudents);
    
    // Initialize all students as present
    const initialAttendance: Record<string, boolean> = {};
    filteredStudents.forEach(student => {
      initialAttendance[student.id] = true;
    });
    
    setAttendingStudents(initialAttendance);
  }, [selectedClass, selectedSection]);
  
  // Effect for loading attendance records
  useEffect(() => {
    let filteredRecords = [...attendanceRecords];
    
    if (role === 'student' && user) {
      const studentUser = user as Student;
      filteredRecords = attendanceRecords.filter(record => 
        record.classId === studentUser.class && record.section === studentUser.section
      );
    } else {
      // Filter by selected class
      if (selectedViewClass) {
        const classData = classes.find(c => c.id === selectedViewClass);
        if (classData) {
          const classId = parseInt(classData.name);
          filteredRecords = filteredRecords.filter(record => record.classId === classId);
        }
      }
      
      // Filter by selected section
      if (selectedViewSection) {
        filteredRecords = filteredRecords.filter(record => 
          record.section === selectedViewSection
        );
      }
      
      // Filter by selected subject
      if (selectedViewSubject && selectedViewSubject !== 'all-subjects') {
        filteredRecords = filteredRecords.filter(record => 
          record.subjectId === selectedViewSubject
        );
      }
    }
    
    setAttendanceRecords(filteredRecords);
  }, [selectedViewClass, selectedViewSection, selectedViewSubject, role, user]);
  
  // Check if the current selection is assigned to the teacher
  useEffect(() => {
    if (role !== 'teacher' || !teacherAssignments) {
      setIsAssignedToSelection(true);
      return;
    }

    const classData = classes.find(c => c.id === selectedClass);
    if (!classData || !selectedSection || !selectedSubject) {
      setIsAssignedToSelection(false);
      return;
    }

    const classId = parseInt(classData.name);
    
    const isAssigned = teacherAssignments.some(
      assignment => 
        assignment.classId === classId && 
        assignment.section === selectedSection &&
        assignment.subjectId === selectedSubject
    );
    
    setIsAssignedToSelection(isAssigned);
  }, [selectedClass, selectedSection, selectedSubject, teacherAssignments, role]);
  
  // Handle attendance submission
  const handleSubmitAttendance = () => {
    if (!selectedClass || !selectedSection || !selectedSubject) {
      toast({
        title: "Required Fields Missing",
        description: "Please select class, section, and subject.",
        variant: "destructive"
      });
      return;
    }

    // Check if teacher is assigned to this class-section-subject
    if (role === 'teacher' && !isAssignedToSelection) {
      toast({
        title: "Access Denied",
        description: "You are not assigned to teach this combination of class, section, and subject.",
        variant: "destructive"
      });
      return;
    }
    
    // Get present and absent students
    const presentStudents = Object.entries(attendingStudents)
      .filter(([_, isPresent]) => isPresent)
      .map(([studentId, _]) => studentId);
    
    const absentStudents = Object.entries(attendingStudents)
      .filter(([_, isPresent]) => !isPresent)
      .map(([studentId, _]) => studentId);

    const classData = classes.find(c => c.id === selectedClass);
    if (!classData) return;
    
    const classId = parseInt(classData.name);
    
    // Create new attendance record
    const newRecord: AttendanceRecord = {
      id: `attendance-${Date.now()}`,
      date: selectedDate.toISOString().split('T')[0],
      classId: classId,
      section: selectedSection,
      subjectId: selectedSubject,
      presentStudents,
      absentStudents,
      teacherId: user?.id || '', 
    };
    
    // In a real app, you would send this to your backend
    // For now, let's just update our local state
    setAttendanceRecords(prev => [newRecord, ...prev]);
    
    toast({
      title: "Attendance Recorded",
      description: `Attendance submitted for Class ${classId}, Section ${selectedSection}.`,
    });
    
    // Reset form and switch to records tab
    setSelectedClass('');
    setSelectedSection('');
    setSelectedSubject('');
    setActiveTab("records");
  };
  
  // Helper function to get subject name by ID
  const getSubjectName = (subjectId: string): string => {
    // Check in all subject groups
    for (const groupKey in subjects) {
      const subjectList = subjects[groupKey as keyof typeof subjects] || [];
      const subject = subjectList.find(s => s.id === subjectId);
      if (subject) return subject.name;
    }
    
    return "Unknown Subject";
  };
  
  // Render appropriate component based on user role
  if (role === 'student') {
    return <StudentAttendanceView attendanceRecords={attendanceRecords} />;
  }
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{role === 'teacher' ? 'Class Attendance' : 'Attendance Management'}</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex space-x-1 rounded-md bg-muted p-1 mb-6">
            <TabsTrigger value="mark" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center">
              <ClipboardList className="mr-2 h-4 w-4" />
              View Records
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mark">
            <AttendanceForm
              classOptions={classOptions}
              sectionOptions={sectionOptions}
              subjectOptions={subjectOptions}
              studentOptions={studentOptions}
              selectedClass={selectedClass}
              selectedSection={selectedSection}
              selectedSubject={selectedSubject}
              selectedDate={selectedDate}
              attendingStudents={attendingStudents}
              setSelectedClass={setSelectedClass}
              setSelectedSection={setSelectedSection}
              setSelectedSubject={setSelectedSubject}
              setSelectedDate={setSelectedDate}
              setAttendingStudents={setAttendingStudents}
              onSubmit={handleSubmitAttendance}
              isAssigned={isAssignedToSelection}
              role={role}
            />
          </TabsContent>
          
          <TabsContent value="records">
            <AttendanceRecordsView
              classOptions={classOptions}
              sectionOptions={sectionOptions}
              subjectOptions={subjectOptions}
              selectedClass={selectedViewClass}
              selectedSection={selectedViewSection}
              selectedSubject={selectedViewSubject}
              attendanceRecords={attendanceRecords}
              setSelectedClass={setSelectedViewClass}
              setSelectedSection={setSelectedViewSection}
              setSelectedSubject={setSelectedViewSubject}
              getSubjectName={getSubjectName}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttendancePage;
