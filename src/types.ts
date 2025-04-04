
// User roles
export type UserRole = 'admin' | 'teacher' | 'student';

// Exam types
export type ExamType = 'unit_test' | 'quarterly' | 'half_yearly' | 'final' | 'other';

// Base user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

// Admin user
export interface Admin extends User {
  role: 'admin';
  contactNumber: string;
}

// Teacher user
export interface Teacher extends User {
  role: 'teacher';
  subjects: {
    id: string;
    name: string;
    classesApplicable: number[];
    code: string;
  }[];
  classes: {
    classId: number;
    section: string;
    subjectId: string;
  }[];
  contactNumber: string;
  qualification: string;
  joiningDate: string;
}

// Student user
export interface Student extends User {
  role: 'student';
  registrationNumber: string;
  class: number;
  section: string;
  rollNumber: string;
  dateOfBirth: string;
  parentName: string;
  parentContact: string;
  address: string;
  admissionDate: string;
}

// Class and section models
export interface Section {
  id: string;
  name: string;
}

export interface ClassData {
  id: string;
  name: string;
  sections: Section[];
}

// Subject model
export interface Subject {
  id: string;
  name: string;
  code: string;
  classesApplicable: number[];
}

// Attendance models
export interface AttendanceRecord {
  id: string;
  date: string;
  classId: number;
  section: string;
  subjectId: string;
  presentStudents: string[];
  absentStudents: string[];
  teacherId: string;
}

// Lesson plan models
export interface LessonPlan {
  id: string;
  title: string;
  description: string;
  classId: number;
  section: string;
  subjectId: string;
  teacherId: string;
  dateCreated: string;
  dateRange: {
    start: string;
    end: string;
  };
  content: string;
  attachments: string[];
}

// Recorded class models
export interface RecordedClass {
  id: string;
  title: string;
  description: string;
  classId: number;
  section: string;
  subjectId: string;
  teacherId: string;
  dateRecorded: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
}

// School event models
export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  type: 'sports' | 'cultural' | 'exam' | 'holiday' | 'other';
  forClasses?: number[];
  createdBy: string;
  createdAt: string;
}

// Exam models
export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  startDate: string;
  endDate: string;
  maxMarks: number;
  classesApplicable: number[];
}

// Student result models
export interface StudentResult {
  id: string;
  studentId: string;
  examId: string;
  subjectId: string;
  marksObtained: number;
  remarks?: string;
  teacherId: string;
}

// Study material models
export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  classId: number;
  section: string;
  subjectId: string;
  teacherId: string;
  dateUploaded: string;
  fileUrl: string;
  fileType: string;
}

// Dashboard stats
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  upcomingEvents: number;
  attendanceToday: {
    present: number;
    absent: number;
    percentage: number;
  };
}
