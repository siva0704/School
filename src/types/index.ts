
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  class?: number;
  section?: string;
}

export interface Teacher extends User {
  subjects: string[];
  classes: {
    classId: number;
    section: string;
    subjectId: string;
  }[];
}

export interface Student extends User {
  class: number;
  section: string;
  rollNumber: string;
  parentName?: string;
  parentContact?: string;
}

export interface ClassData {
  id: string;
  name: string;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classesApplicable: number[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  type: 'holiday' | 'exam' | 'activity' | 'meeting';
  classesApplicable?: number[];
}

export interface LessonPlan {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  classId: number;
  section: string;
  date: string;
  teacherId: string;
  resources: string[];
  homeworkAssigned?: string;
}

export interface RecordedClass {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  section: string;
  teacherId: string;
  recordedDate: string;
  dateRecorded: string;
  duration: string | number;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: number;
  section: string;
  subjectId: string;
  presentStudents: string[]; // array of student IDs
  absentStudents: string[]; // array of student IDs
}

export interface Exam {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'quarterly' | 'half-yearly' | 'final' | 'unit-test';
  maxMarks: number;
  classesApplicable: number[];
}

export interface StudentResult {
  id: string;
  studentId: string;
  examId: string;
  subjectId: string;
  marksObtained: number;
  remarks?: string;
}

export interface TeacherAssignment {
  teacherId: string;
  classId: number;
  section: string;
  subjectId: string;
}
