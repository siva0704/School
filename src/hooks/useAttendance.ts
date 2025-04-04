
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  ClassData, 
  Student, 
  Teacher,
  Subject, 
  AttendanceRecord 
} from '@/types';

import { 
  classes, 
  teachers, 
  students as allStudents,
  subjects as allSubjectGroups 
} from '@/data/mock-data';

export const useAttendance = () => {
  const { user, role, teacherAssignments } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const classParam = searchParams.get('class');
  const sectionParam = searchParams.get('section');
  
  const [activeTab, setActiveTab] = useState('mark');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // States for attendance marking
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendingStudents, setAttendingStudents] = useState<Record<string, boolean>>({});
  
  // Data states
  const [classOptions, setClassOptions] = useState<ClassData[]>([]);
  const [sectionOptions, setSectionOptions] = useState<string[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  
  // Records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Log teacher assignments for debugging
  useEffect(() => {
    console.log('User role:', role);
    console.log('Teacher assignments in hook:', teacherAssignments);
    
    if (role === 'teacher' && user) {
      const teacher = teachers.find(t => t.id === user.id);
      console.log('Found teacher:', teacher);
      if (teacher) {
        setCurrentTeacher(teacher);
        console.log('Teacher assignments from data:', teacher.classes);
      }
    }
  }, [user, role, teacherAssignments]);
  
  // Setup class options based on role and teacher assignments
  useEffect(() => {
    let filteredClasses: ClassData[] = [];
    
    if (role === 'teacher' && teacherAssignments && teacherAssignments.length > 0) {
      console.log('Filtering classes for teacher with assignments:', teacherAssignments);
      // Filter classes to only show the ones assigned to this teacher
      const teacherClassIds = [...new Set(teacherAssignments.map(assignment => assignment.classId))];
      console.log('Teacher class IDs:', teacherClassIds);
      
      filteredClasses = classes.filter(c => 
        teacherClassIds.includes(parseInt(c.name))
      );
      console.log('Filtered classes for teacher:', filteredClasses);
    } else if (role === 'student' && currentStudent) {
      // For student, only show their own class
      filteredClasses = classes.filter(c => 
        parseInt(c.name) === currentStudent.class
      );
      
      // Auto-select the student's class
      if (filteredClasses.length > 0) {
        setSelectedClass(filteredClasses[0].id);
      }
    } else if (role === 'admin') {
      filteredClasses = classes;
    }
    
    setClassOptions(filteredClasses);
    
    // If we have class from URL parameters, set it
    if (classParam && filteredClasses.some(c => c.name === classParam)) {
      const classObj = filteredClasses.find(c => c.name === classParam);
      if (classObj) {
        setSelectedClass(classObj.id);
      }
    } else if (filteredClasses.length === 1) {
      // Set default class if there's only one option
      setSelectedClass(filteredClasses[0].id);
    }
  }, [currentTeacher, currentStudent, role, classParam, teacherAssignments]);
  
  // Setup sections based on selected class and teacher's assigned sections
  useEffect(() => {
    if (!selectedClass) {
      setSectionOptions([]);
      return;
    }
    
    const classItem = classes.find(c => c.id === selectedClass);
    if (!classItem) {
      setSectionOptions([]);
      return;
    }
    
    let availableSections = classItem.sections.map(s => s.name);
    
    if (role === 'teacher' && teacherAssignments && teacherAssignments.length > 0) {
      const classNumber = parseInt(classItem.name, 10);
      
      // Filter sections based on teacher assignments for the selected class
      const assignedSections = teacherAssignments
        .filter(assignment => assignment.classId === classNumber)
        .map(assignment => assignment.section);
      
      console.log(`Teacher sections for class ${classNumber}:`, assignedSections);
      
      if (assignedSections.length > 0) {
        availableSections = availableSections.filter(section => 
          assignedSections.includes(section)
        );
      }
      
      console.log('Available sections after filtering:', availableSections);
    } else if (role === 'student' && currentStudent) {
      // For student, only show their own section
      availableSections = availableSections.filter(section => section === currentStudent.section);
    }
    
    setSectionOptions(availableSections);
    
    // If we have section from URL parameters, set it
    if (sectionParam && availableSections.includes(sectionParam)) {
      setSelectedSection(sectionParam);
    } else if (availableSections.length === 1) {
      // Set default section if there's only one
      setSelectedSection(availableSections[0]);
    } else if (availableSections.length === 0) {
      setSelectedSection('');
    }
  }, [selectedClass, role, sectionParam, teacherAssignments, currentStudent]);
  
  // Setup subject options based on role, selected class, and teacher assignments
  useEffect(() => {
    if (!selectedClass || !selectedSection) {
      setSubjectOptions([]);
      return;
    }
    
    const classNumber = parseInt(classes.find(c => c.id === selectedClass)?.name || '0', 10);
    
    let filteredSubjects: Subject[] = [];
    
    console.log('Finding subjects for class:', classNumber, 'section:', selectedSection);
    
    if (role === 'teacher' && teacherAssignments && teacherAssignments.length > 0) {
      // Get subjects that this teacher teaches for the selected class and section
      const assignmentsForClass = teacherAssignments.filter(
        assignment => assignment.classId === classNumber && 
                     assignment.section === selectedSection
      );
      
      console.log('Assignments for this class and section:', assignmentsForClass);
      
      const classSubjectIds = assignmentsForClass.map(assignment => assignment.subjectId);
      console.log('Subject IDs for this class and section:', classSubjectIds);
      
      // Find subjects from all subject groups that match the IDs
      for (const group in allSubjectGroups) {
        const subjects = allSubjectGroups[group as keyof typeof allSubjectGroups] || [];
        const matchingSubjects = subjects.filter(subject => 
          classSubjectIds.includes(subject.id) && 
          subject.classesApplicable.includes(classNumber)
        );
        filteredSubjects = [...filteredSubjects, ...matchingSubjects];
      }
      
      console.log('Filtered subjects for teacher:', filteredSubjects);
    } else if (role === 'admin') {
      // Get all subjects for this class level
      if (classNumber <= 5) {
        filteredSubjects = allSubjectGroups.primary || [];
      } else if (classNumber <= 8) {
        filteredSubjects = allSubjectGroups.middle || [];
      } else {
        filteredSubjects = allSubjectGroups.secondary || [];
      }
      
      filteredSubjects = filteredSubjects.filter(subject => 
        subject.classesApplicable.includes(classNumber)
      );
    }
    
    setSubjectOptions(filteredSubjects);
    
    // Set default subject if available
    if (filteredSubjects.length === 1) {
      setSelectedSubject(filteredSubjects[0].id);
    } else if (filteredSubjects.length === 0) {
      setSelectedSubject('');
    }
  }, [selectedClass, selectedSection, role, teacherAssignments]);
  
  // Setup student options based on selected class and section
  useEffect(() => {
    if (!selectedClass || !selectedSection) {
      setStudentOptions([]);
      setAttendingStudents({});
      return;
    }
    
    const classNumber = parseInt(classes.find(c => c.id === selectedClass)?.name || '0', 10);
    
    const filteredStudents = allStudents.filter(student => 
      student.class === classNumber && student.section === selectedSection
    );
    
    setStudentOptions(filteredStudents);
    
    // Initialize attendance state for all students
    const initialAttendance: Record<string, boolean> = {};
    filteredStudents.forEach(student => {
      initialAttendance[student.id] = true; // Default to present
    });
    
    setAttendingStudents(initialAttendance);
  }, [selectedClass, selectedSection]);
  
  // Sample records (in a real app, these would be fetched from an API)
  useEffect(() => {
    const sampleRecords: AttendanceRecord[] = [];
    
    // Generate some sample records if we have all the required selections
    if (selectedClass && selectedSection && selectedSubject) {
      const classNumber = parseInt(classes.find(c => c.id === selectedClass)?.name || '0', 10);
      
      // Get students for this class and section
      const classStudents = allStudents.filter(
        student => student.class === classNumber && student.section === selectedSection
      );
      
      // Generate records for the past 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Randomly mark some students as absent
        const presentStudents = classStudents
          .filter(() => Math.random() > 0.1) // 10% chance of being absent
          .map(student => student.id);
        
        const absentStudents = classStudents
          .filter(student => !presentStudents.includes(student.id))
          .map(student => student.id);
        
        sampleRecords.push({
          id: `record-${i}`,
          date: date.toISOString().split('T')[0],
          classId: classNumber,
          section: selectedSection,
          subjectId: selectedSubject,
          presentStudents,
          absentStudents,
          teacherId: user?.id || '',
        });
      }
    }
    
    setAttendanceRecords(sampleRecords);
  }, [selectedClass, selectedSection, selectedSubject, user?.id]);

  // Handle marking attendance
  const handleSubmitAttendance = () => {
    if (!selectedClass || !selectedSection || !selectedSubject) {
      toast({
        title: "Missing Information",
        description: "Please select class, section, and subject.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if teacher is allowed to mark attendance for this combination
    if (role === 'teacher' && teacherAssignments) {
      const classNumber = parseInt(classes.find(c => c.id === selectedClass)?.name || '0', 10);
      
      const isAllowed = teacherAssignments.some(
        assignment => 
          assignment.classId === classNumber &&
          assignment.section === selectedSection &&
          assignment.subjectId === selectedSubject
      );
      
      if (!isAllowed) {
        toast({
          title: "Access Denied",
          description: "You are not assigned to teach this class, section, or subject.",
          variant: "destructive"
        });
        return;
      }
    }
    
    const classNumber = parseInt(classes.find(c => c.id === selectedClass)?.name || '0', 10);
    
    // Filter students based on attendance
    const presentStudents = Object.entries(attendingStudents)
      .filter(([_, isPresent]) => isPresent)
      .map(([studentId]) => studentId);
    
    const absentStudents = Object.entries(attendingStudents)
      .filter(([_, isPresent]) => !isPresent)
      .map(([studentId]) => studentId);
    
    // Create a new attendance record
    const newRecord: AttendanceRecord = {
      id: `record-${Date.now()}`,
      date: selectedDate.toISOString().split('T')[0],
      classId: classNumber,
      section: selectedSection,
      subjectId: selectedSubject,
      presentStudents,
      absentStudents,
      teacherId: user?.id || '',
    };
    
    // In a real app, you would send this to an API
    console.log('New attendance record:', newRecord);
    
    // Update local state
    setAttendanceRecords(prev => [newRecord, ...prev]);
    
    toast({
      title: "Attendance Marked",
      description: `Attendance for Class ${classNumber}${selectedSection} has been recorded.`,
    });
  };
  
  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    // Check in all subject groups
    for (const group in allSubjectGroups) {
      const foundSubject = allSubjectGroups[group as keyof typeof allSubjectGroups]?.find(s => s.id === subjectId);
      if (foundSubject) return foundSubject.name;
    }
    
    return 'Unknown Subject';
  };
  
  // Get student name by ID
  const getStudentName = (studentId: string) => {
    const student = allStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  // Check if teacher is assigned to a specific combination
  const isTeacherAssigned = (classId: number, section: string, subjectId: string) => {
    if (role !== 'teacher' || !teacherAssignments) return true; // Admin can access all
    
    return teacherAssignments.some(
      assignment => 
        assignment.classId === classId &&
        assignment.section === section &&
        assignment.subjectId === subjectId
    );
  };

  return {
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    selectedClass,
    setSelectedClass,
    selectedSection,
    setSelectedSection,
    selectedSubject,
    setSelectedSubject,
    attendingStudents,
    setAttendingStudents,
    classOptions,
    sectionOptions,
    subjectOptions,
    studentOptions,
    currentStudent,
    attendanceRecords,
    handleSubmitAttendance,
    getSubjectName,
    getStudentName,
    isTeacherAssigned
  };
};
