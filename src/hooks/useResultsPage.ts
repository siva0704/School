
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Student, Teacher, Subject, Exam, StudentResult } from '@/types';

interface UseResultsPageProps {
  teachers: Teacher[];
  classes: {
    id: string;
    name: string;
    sections: { id: string; name: string; }[];
  }[];
  allSubjects: Subject[];
  exams: Exam[];
  allStudents: Student[];
  studentResults: StudentResult[];
}

export const useResultsPage = ({
  teachers,
  classes,
  allSubjects,
  exams,
  allStudents,
  studentResults,
}: UseResultsPageProps) => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('view');
  
  // View Results States
  const [selectedViewClass, setSelectedViewClass] = useState('');
  const [selectedViewSection, setSelectedViewSection] = useState('');
  const [selectedViewExam, setSelectedViewExam] = useState('all-exams');
  const [selectedViewStudent, setSelectedViewStudent] = useState('all-students');
  const [selectedViewSubject, setSelectedViewSubject] = useState('all-subjects');
  const [results, setResults] = useState<StudentResult[]>([]);
  
  // Add Results States
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marksObtained, setMarksObtained] = useState('');
  const [remarks, setRemarks] = useState('');
  
  // Filtered Options
  const [classOptions, setClassOptions] = useState<{ id: string; name: string }[]>([]);
  const [sectionOptions, setSectionOptions] = useState<string[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);
  const [examOptions, setExamOptions] = useState<Exam[]>([]);
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  
  const [maxMarks, setMaxMarks] = useState(0);
  
  // Get teacher data if user is a teacher
  const [teacherAssignments, setTeacherAssignments] = useState<{
    classId: number;
    section: string;
    subjectId: string;
  }[]>([]);
  
  // Get teacher data and their assigned classes
  useEffect(() => {
    if (role === 'teacher' && user?.id) {
      // Find the current teacher in the teachers array
      const teacherData = teachers.find(t => t.id === user.id) as Teacher | undefined;
      
      if (teacherData) {
        console.log('Teacher data loaded:', teacherData);
        setTeacherAssignments(teacherData.classes || []);
      }
    }
  }, [role, user, teachers]);
  
  // Get class options based on role and teacher assignments
  useEffect(() => {
    let availableClasses = classes.map(c => ({ id: c.id, name: c.name }));
    
    if (role === 'teacher' && teacherAssignments.length > 0) {
      // Filter classes for teacher based on their assignments
      const teacherClassIds = [...new Set(teacherAssignments.map(assignment => assignment.classId))];
      availableClasses = availableClasses.filter(c => 
        teacherClassIds.includes(parseInt(c.id.replace('class', ''), 10))
      );
      
      console.log('Teacher class IDs:', teacherClassIds);
      console.log('Available classes for teacher:', availableClasses);
    }
    
    setClassOptions(availableClasses);
    
    // Set default class if only one option
    if (availableClasses.length === 1) {
      setSelectedClass(availableClasses[0].id);
      setSelectedViewClass(availableClasses[0].id);
    }
  }, [role, teacherAssignments, classes]);
  
  // Update section options when class is selected, filtering by teacher assignments
  useEffect(() => {
    if (!selectedClass) return;
    
    const selectedClassObj = classes.find(c => c.id === selectedClass);
    if (selectedClassObj) {
      let sections = selectedClassObj.sections.map(s => s.name);
      
      // Filter sections based on teacher assignments if user is a teacher
      if (role === 'teacher' && teacherAssignments.length > 0) {
        const classId = parseInt(selectedClass.replace('class', ''), 10);
        const teacherSections = teacherAssignments
          .filter(assignment => assignment.classId === classId)
          .map(assignment => assignment.section);
        
        console.log('Teacher sections for class', classId, ':', teacherSections);
        
        if (teacherSections.length > 0) {
          sections = sections.filter(section => teacherSections.includes(section));
        }
      }
      
      setSectionOptions(sections);
      
      // Set default section if only one option
      if (sections.length === 1) {
        setSelectedSection(sections[0]);
      } else {
        setSelectedSection('');
      }
    }
  }, [selectedClass, role, teacherAssignments, classes]);
  
  // Update view section options when view class is selected, filtering by teacher assignments
  useEffect(() => {
    if (!selectedViewClass) return;
    
    const selectedClassObj = classes.find(c => c.id === selectedViewClass);
    if (selectedClassObj) {
      let sections = selectedClassObj.sections.map(s => s.name);
      
      // Filter sections based on teacher assignments if user is a teacher
      if (role === 'teacher' && teacherAssignments.length > 0) {
        const classId = parseInt(selectedViewClass.replace('class', ''), 10);
        const teacherSections = teacherAssignments
          .filter(assignment => assignment.classId === classId)
          .map(assignment => assignment.section);
        
        if (teacherSections.length > 0) {
          sections = sections.filter(section => teacherSections.includes(section));
        }
      }
      
      setSectionOptions(sections);
      
      // Set default section if only one option
      if (sections.length === 1) {
        setSelectedViewSection(sections[0]);
      } else {
        setSelectedViewSection('');
      }
    }
  }, [selectedViewClass, role, teacherAssignments, classes]);
  
  // Update subject options when class is selected, filtering by teacher assignments
  useEffect(() => {
    if (!selectedClass) return;
    
    const classNumber = parseInt(selectedClass.replace('class', ''), 10);
    
    let filteredSubjects = allSubjects.filter(s => 
      s.classesApplicable.includes(classNumber)
    );
    
    // Filter subjects based on teacher assignments if user is a teacher
    if (role === 'teacher' && teacherAssignments.length > 0 && selectedSection) {
      const teacherSubjectIds = teacherAssignments
        .filter(assignment => assignment.classId === classNumber && assignment.section === selectedSection)
        .map(assignment => assignment.subjectId);
      
      console.log('Teacher subject IDs for class', classNumber, 'section', selectedSection, ':', teacherSubjectIds);
      
      if (teacherSubjectIds.length > 0) {
        filteredSubjects = filteredSubjects.filter(subject => teacherSubjectIds.includes(subject.id));
      }
    }
    
    setSubjectOptions(filteredSubjects);
    
    // Look for mathematics subject first - PRIORITIZE MATHEMATICS
    const mathSubject = filteredSubjects.find(subject => 
      subject.name.toLowerCase().includes('math') || 
      subject.name.toLowerCase().includes('maths') ||
      subject.name.toLowerCase().includes('mathematics')
    );
    
    // Set default subject - prefer math if available
    if (mathSubject) {
      setSelectedSubject(mathSubject.id);
      console.log("Setting math as default subject:", mathSubject.name);
    } else if (filteredSubjects.length === 1) {
      setSelectedSubject(filteredSubjects[0].id);
    } else if (filteredSubjects.length > 0) {
      setSelectedSubject(filteredSubjects[0].id);
    } else {
      setSelectedSubject('');
    }
  }, [selectedClass, selectedSection, allSubjects, role, teacherAssignments]);
  
  // Update subject options for view results
  useEffect(() => {
    if (!selectedViewClass) return;
    
    const classNumber = parseInt(selectedViewClass.replace('class', ''), 10);
    
    let filteredSubjects = allSubjects.filter(s => 
      s.classesApplicable.includes(classNumber)
    );
    
    // Filter subjects based on teacher assignments if user is a teacher
    if (role === 'teacher' && teacherAssignments.length > 0 && selectedViewSection) {
      const teacherSubjectIds = teacherAssignments
        .filter(assignment => assignment.classId === classNumber && assignment.section === selectedViewSection)
        .map(assignment => assignment.subjectId);
      
      if (teacherSubjectIds.length > 0) {
        filteredSubjects = filteredSubjects.filter(subject => teacherSubjectIds.includes(subject.id));
      }
    }
    
    setSubjectOptions(filteredSubjects);
    
    // Reset subject selection when class changes
    setSelectedViewSubject('all-subjects');
  }, [selectedViewClass, selectedViewSection, allSubjects, role, teacherAssignments]);
  
  // Update exam options
  useEffect(() => {
    if (!selectedClass) return;
    
    const classNumber = parseInt(selectedClass.replace('class', ''), 10);
    
    // Filter exams applicable to the selected class
    const filteredExams = exams.filter(exam => 
      exam.classesApplicable.includes(classNumber)
    );
    
    setExamOptions(filteredExams);
    
    // Set default exam if only one option
    if (filteredExams.length === 1) {
      setSelectedExam(filteredExams[0].id);
      
      // Set max marks based on the selected exam
      setMaxMarks(filteredExams[0].maxMarks);
    } else if (filteredExams.length > 0) {
      setSelectedExam(filteredExams[0].id);
      setMaxMarks(filteredExams[0].maxMarks);
    } else {
      setSelectedExam('');
      setMaxMarks(0);
    }
  }, [selectedClass, exams]);
  
  // Update view exam options
  useEffect(() => {
    if (!selectedViewClass) return;
    
    const classNumber = parseInt(selectedViewClass.replace('class', ''), 10);
    
    // Filter exams applicable to the selected class
    const filteredExams = exams.filter(exam => 
      exam.classesApplicable.includes(classNumber)
    );
    
    setExamOptions(filteredExams);
  }, [selectedViewClass, exams]);
  
  // Set max marks when exam is selected
  useEffect(() => {
    if (!selectedExam) return;
    
    const exam = exams.find(e => e.id === selectedExam);
    if (exam) {
      setMaxMarks(exam.maxMarks);
    } else {
      setMaxMarks(0);
    }
  }, [selectedExam, exams]);
  
  // Update student options when class and section are selected
  useEffect(() => {
    if (!selectedClass || !selectedSection) return;
    
    const classNumber = parseInt(selectedClass.replace('class', ''), 10);
    
    // Filter students by class and section
    const filteredStudents = allStudents.filter(student => 
      student.class === classNumber && student.section === selectedSection
    );
    
    setStudentOptions(filteredStudents);
    
    // Set default student if only one option
    if (filteredStudents.length === 1) {
      setSelectedStudent(filteredStudents[0].id);
    } else if (filteredStudents.length > 0) {
      setSelectedStudent(filteredStudents[0].id);
    } else {
      setSelectedStudent('');
    }
  }, [selectedClass, selectedSection, allStudents]);
  
  // Update view student options when view class and section are selected
  useEffect(() => {
    if (!selectedViewClass || !selectedViewSection) return;
    
    const classNumber = parseInt(selectedViewClass.replace('class', ''), 10);
    
    // Filter students by class and section
    const filteredStudents = allStudents.filter(student => 
      student.class === classNumber && student.section === selectedViewSection
    );
    
    setStudentOptions(filteredStudents);
    
    // Set default student to "all-students"
    setSelectedViewStudent('all-students');
  }, [selectedViewClass, selectedViewSection, allStudents]);
  
  // Fetch results based on selected filters
  useEffect(() => {
    // Skip if no class and section selected
    if (!selectedViewClass || !selectedViewSection) {
      setResults([]);
      return;
    }
    
    const classNumber = parseInt(selectedViewClass.replace('class', ''), 10);
    
    // Get students in this class and section
    const classStudents = allStudents
      .filter(student => student.class === classNumber && student.section === selectedViewSection)
      .map(student => student.id);
    
    let filteredResults = [...studentResults].filter(result => 
      classStudents.includes(result.studentId)
    );
    
    // Filter by exam if selected
    if (selectedViewExam && selectedViewExam !== 'all-exams') {
      filteredResults = filteredResults.filter(result => 
        result.examId === selectedViewExam
      );
    }
    
    // Filter by student if specific student selected
    if (selectedViewStudent && selectedViewStudent !== 'all-students') {
      filteredResults = filteredResults.filter(result => 
        result.studentId === selectedViewStudent
      );
    }
    
    // Filter by subject if specific subject selected
    if (selectedViewSubject && selectedViewSubject !== 'all-subjects') {
      filteredResults = filteredResults.filter(result => 
        result.subjectId === selectedViewSubject
      );
    }
    
    setResults(filteredResults);
  }, [
    selectedViewClass, 
    selectedViewSection, 
    selectedViewExam, 
    selectedViewStudent,
    selectedViewSubject,
    studentResults, 
    allStudents
  ]);
  
  // Handle form submission for adding a new result
  const handleAddResult = () => {
    if (!selectedClass || !selectedSection || !selectedSubject || !selectedExam || !selectedStudent || !marksObtained) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const marks = parseInt(marksObtained, 10);
    
    if (isNaN(marks) || marks < 0 || marks > maxMarks) {
      toast({
        title: "Invalid Marks",
        description: `Marks should be between 0 and ${maxMarks}.`,
        variant: "destructive"
      });
      return;
    }
    
    // Create a new result
    const newResult: StudentResult = {
      id: `result-${Date.now()}`,
      studentId: selectedStudent,
      examId: selectedExam,
      subjectId: selectedSubject,
      marksObtained: marks,
      remarks: remarks.trim() || '',
      teacherId: user?.id || ''
    };
    
    // In a real app, you would save this to your database
    console.log('New result added:', newResult);
    
    // Add to local state (for demo purposes)
    studentResults.push(newResult);
    
    toast({
      title: "Result Added",
      description: "The student's result has been recorded successfully."
    });
    
    // Reset form fields
    setMarksObtained('');
    setRemarks('');
  };
  
  // Handle teacher quick add from assignments summary
  const handleTeacherAddResults = (classId: string, section: string) => {
    setActiveTab('add');
    setSelectedClass(`class${classId}`);
    setSelectedSection(section);
  };

  return {
    activeTab,
    setActiveTab,
    selectedViewClass,
    setSelectedViewClass,
    selectedViewSection,
    setSelectedViewSection,
    selectedViewExam,
    setSelectedViewExam,
    selectedViewStudent,
    setSelectedViewStudent,
    selectedViewSubject,
    setSelectedViewSubject,
    results,
    selectedClass,
    setSelectedClass,
    selectedSection,
    setSelectedSection,
    selectedSubject,
    setSelectedSubject,
    selectedExam,
    setSelectedExam,
    selectedStudent,
    setSelectedStudent,
    marksObtained,
    setMarksObtained,
    remarks,
    setRemarks,
    maxMarks,
    classOptions,
    sectionOptions,
    subjectOptions,
    examOptions,
    studentOptions,
    handleAddResult,
    teacherAssignments,
    handleTeacherAddResults,
  };
};
