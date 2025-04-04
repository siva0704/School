import { 
  Admin, Teacher, Student, ClassData, Subject, 
  AttendanceRecord, LessonPlan, RecordedClass, 
  SchoolEvent, Exam, StudentResult, StudyMaterial,
  DashboardStats
} from '../types';

// Mock Admin Users
export const admins: Admin[] = [
  {
    id: 'admin1',
    name: 'Rajesh Kumar',
    email: 'principal@vidyaerp.com',
    role: 'admin',
    contactNumber: '+91 9876543210',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
  },
  {
    id: 'admin2',
    name: 'Priya Sharma',
    email: 'viceprincipal@vidyaerp.com',
    role: 'admin',
    contactNumber: '+91 9876543211',
    avatar: 'https://randomuser.me/api/portraits/women/43.jpg'
  }
];

// Mock Teacher Users
export const teachers: Teacher[] = [
  {
    id: 'teacher1',
    name: 'Anjali Gupta',
    email: 'anjali@vidyaerp.com',
    role: 'teacher',
    subjects: [
      { id: 'math_pri', name: 'Mathematics', classesApplicable: [1, 2, 3, 4, 5], code: 'MATH' },
      { id: 'math_mid', name: 'Mathematics', classesApplicable: [6, 7, 8], code: 'MATH' }
    ],
    classes: [
      { classId: 5, section: 'A', subjectId: 'math_pri' },
      { classId: 6, section: 'B', subjectId: 'math_mid' },
      { classId: 7, section: 'A', subjectId: 'math_mid' }
    ],
    contactNumber: '+91 8765432101',
    qualification: 'M.Sc., B.Ed',
    joiningDate: '2020-06-15',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  {
    id: 'teacher2',
    name: 'Suresh Verma',
    email: 'suresh@vidyaerp.com',
    role: 'teacher',
    subjects: [
      { id: 'hin_pri', name: 'Hindi', classesApplicable: [1, 2, 3, 4, 5], code: 'HIN' },
      { id: 'sst_mid', name: 'Social Science', classesApplicable: [6, 7, 8], code: 'SST' }
    ],
    classes: [
      { classId: 3, section: 'A', subjectId: 'hin_pri' },
      { classId: 6, section: 'C', subjectId: 'sst_mid' }
    ],
    contactNumber: '+91 8765432102',
    qualification: 'M.A., B.Ed',
    joiningDate: '2019-07-10',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 'teacher3',
    name: 'Meena Iyer',
    email: 'meena@vidyaerp.com',
    role: 'teacher',
    subjects: [
      { id: 'eng_mid', name: 'English', classesApplicable: [6, 7, 8, 9, 10], code: 'ENG' },
      { id: 'comp_mid', name: 'Computer Science', classesApplicable: [6, 7, 8, 9, 10], code: 'CS' }
    ],
    classes: [
      { classId: 8, section: 'A', subjectId: 'eng_mid' },
      { classId: 9, section: 'B', subjectId: 'comp_mid' }
    ],
    contactNumber: '+91 8765432103',
    qualification: 'M.Phil., B.Ed',
    joiningDate: '2018-06-20',
    avatar: 'https://randomuser.me/api/portraits/women/62.jpg'
  }
];

// Mock Student Users
export const students: Student[] = [
  {
    id: 'student1',
    name: 'Amit Patel',
    email: 'amit@vidyaerp.com',
    role: 'student',
    registrationNumber: 'VID2023001',
    class: 5,
    section: 'A',
    rollNumber: '5A01',
    dateOfBirth: '2013-05-12',
    parentName: 'Rakesh Patel',
    parentContact: '+91 9876543220',
    address: '123 Nehru Road, Mumbai',
    admissionDate: '2019-04-10',
    avatar: 'https://randomuser.me/api/portraits/men/72.jpg'
  },
  {
    id: 'student2',
    name: 'Neha Singh',
    email: 'neha@vidyaerp.com',
    role: 'student',
    registrationNumber: 'VID2023002',
    class: 8,
    section: 'B',
    rollNumber: '8B15',
    dateOfBirth: '2010-11-23',
    parentName: 'Harpreet Singh',
    parentContact: '+91 9876543221',
    address: '456 Gandhi Marg, Delhi',
    admissionDate: '2016-04-05',
    avatar: 'https://randomuser.me/api/portraits/women/72.jpg'
  },
  {
    id: 'student3',
    name: 'Raj Sharma',
    email: 'raj@vidyaerp.com',
    role: 'student',
    registrationNumber: 'VID2023003',
    class: 10,
    section: 'A',
    rollNumber: '10A22',
    dateOfBirth: '2008-02-28',
    parentName: 'Vinod Sharma',
    parentContact: '+91 9876543222',
    address: '789 Subhash Nagar, Pune',
    admissionDate: '2014-04-12',
    avatar: 'https://randomuser.me/api/portraits/men/73.jpg'
  },
  {
    id: 'student4',
    name: 'Priya Desai',
    email: 'priya@vidyaerp.com',
    role: 'student',
    registrationNumber: 'VID2023004',
    class: 3,
    section: 'C',
    rollNumber: '3C05',
    dateOfBirth: '2015-08-10',
    parentName: 'Manish Desai',
    parentContact: '+91 9876543223',
    address: '567 Vijay Path, Bangalore',
    admissionDate: '2021-04-14',
    avatar: 'https://randomuser.me/api/portraits/women/73.jpg'
  },
  // More students for Anjali Gupta's classes
  {
    id: 'student5',
    name: 'Rahul Kumar',
    email: 'rahul@vidyaerp.com',
    role: 'student',
    registrationNumber: 'VID2023005',
    class: 5,
    section: 'A',
    rollNumber: '5A02',
    dateOfBirth: '2013-06-15',
    parentName: 'Mohan Kumar',
    parentContact: '+91 9876543224',
    address: '123 MG Road, Mumbai',
    admissionDate: '2019-04-12',
    avatar: 'https://randomuser.me/api/portraits/men/74.jpg'
  },
  {
    id: 'student6',
    name: 'Ananya Sharma',
    email: 'ananya@vidyaerp.com',
    role: 'student',
    registrationNumber: 'VID2023006',
    class: 6,
    section: 'B',
    rollNumber: '6B01',
    dateOfBirth: '2012-08-21',
    parentName: 'Rajesh Sharma',
    parentContact: '+91 9876543225',
    address: '456 Park Street, Delhi',
    admissionDate: '2018-04-10',
    avatar: 'https://randomuser.me/api/portraits/women/74.jpg'
  },
  {
    id: 'student7',
    name: 'Vikram Singh',
    email: 'vikram@vidyaerp.com',
    role: 'student',
    registrationNumber: 'VID2023007',
    class: 7,
    section: 'A',
    rollNumber: '7A01',
    dateOfBirth: '2011-09-05',
    parentName: 'Amarjeet Singh',
    parentContact: '+91 9876543226',
    address: '789 Lake Road, Chandigarh',
    admissionDate: '2017-04-15',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
  }
];

// Classes with Sections
export const classes: ClassData[] = Array.from({ length: 10 }, (_, i) => {
  const classNumber = i + 1;
  return {
    id: `class${classNumber}`,
    name: `${classNumber}`,
    sections: ['A', 'B', 'C'].map(secName => ({
      id: `class${classNumber}${secName}`,
      name: secName
    }))
  };
});

// Subjects per class level
export const subjects: Record<string, Subject[]> = {
  // Classes 1-5
  'primary': [
    { id: 'eng_pri', name: 'English', classesApplicable: [1, 2, 3, 4, 5], code: 'ENG' },
    { id: 'hin_pri', name: 'Hindi', classesApplicable: [1, 2, 3, 4, 5], code: 'HIN' },
    { id: 'math_pri', name: 'Mathematics', classesApplicable: [1, 2, 3, 4, 5], code: 'MATH' },
    { id: 'evs_pri', name: 'EVS', classesApplicable: [1, 2, 3, 4, 5], code: 'EVS' },
    { id: 'gk_pri', name: 'General Knowledge', classesApplicable: [1, 2, 3, 4, 5], code: 'GK' },
    { id: 'comp_pri', name: 'Computer', classesApplicable: [1, 2, 3, 4, 5], code: 'COMP' }
  ],
  
  // Classes 6-8
  'middle': [
    { id: 'eng_mid', name: 'English', classesApplicable: [6, 7, 8], code: 'ENG' },
    { id: 'hin_mid', name: 'Hindi', classesApplicable: [6, 7, 8], code: 'HIN' },
    { id: 'math_mid', name: 'Mathematics', classesApplicable: [6, 7, 8], code: 'MATH' },
    { id: 'sci_mid', name: 'Science', classesApplicable: [6, 7, 8], code: 'SCI' },
    { id: 'sst_mid', name: 'Social Science', classesApplicable: [6, 7, 8], code: 'SST' },
    { id: 'comp_mid', name: 'Computer', classesApplicable: [6, 7, 8], code: 'COMP' },
    { id: 'gk_mid', name: 'General Knowledge', classesApplicable: [6, 7, 8], code: 'GK' }
  ],
  
  // Classes 9-10
  'secondary': [
    { id: 'eng_sec', name: 'English', classesApplicable: [9, 10], code: 'ENG' },
    { id: 'hin_sec', name: 'Hindi', classesApplicable: [9, 10], code: 'HIN' },
    { id: 'math_sec', name: 'Mathematics', classesApplicable: [9, 10], code: 'MATH' },
    { id: 'phy_sec', name: 'Physics', classesApplicable: [9, 10], code: 'PHY' },
    { id: 'chem_sec', name: 'Chemistry', classesApplicable: [9, 10], code: 'CHEM' },
    { id: 'bio_sec', name: 'Biology', classesApplicable: [9, 10], code: 'BIO' },
    { id: 'hist_sec', name: 'History', classesApplicable: [9, 10], code: 'HIST' },
    { id: 'geo_sec', name: 'Geography', classesApplicable: [9, 10], code: 'GEO' },
    { id: 'civ_sec', name: 'Civics', classesApplicable: [9, 10], code: 'CIV' },
    { id: 'eco_sec', name: 'Economics', classesApplicable: [9, 10], code: 'ECO' },
    { id: 'comp_sec', name: 'Computer', classesApplicable: [9, 10], code: 'COMP' }
  ]
};

// All subjects in a flat array for easy access
export const allSubjects: Subject[] = [
  ...subjects.primary,
  ...subjects.middle,
  ...subjects.secondary
];

// Attendance Records
const today = new Date().toISOString().split('T')[0];
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'att1',
    date: today,
    classId: 5,
    section: 'A',
    subjectId: 'math_pri',
    presentStudents: ['student1', 'student5'],
    absentStudents: [],
    teacherId: 'teacher1'
  },
  {
    id: 'att2',
    date: today,
    classId: 6,
    section: 'B',
    subjectId: 'math_mid',
    presentStudents: ['student6'],
    absentStudents: [],
    teacherId: 'teacher1'
  },
  {
    id: 'att3',
    date: today,
    classId: 7,
    section: 'A',
    subjectId: 'math_mid',
    presentStudents: ['student7'],
    absentStudents: [],
    teacherId: 'teacher1'
  }
];

// Lesson Plans
export const lessonPlans: LessonPlan[] = [
  {
    id: 'lp1',
    title: 'Introduction to Fractions',
    description: 'Understanding basic fractions and their applications',
    classId: 5,
    section: 'A',
    subjectId: 'math_pri',
    teacherId: 'teacher1',
    dateCreated: '2023-04-01',
    dateRange: {
      start: '2023-04-10',
      end: '2023-04-17'
    },
    content: 'Week 1: Introduction to fractions\nWeek 2: Addition and subtraction of fractions\nWeek 3: Multiplication of fractions\nWeek 4: Division of fractions',
    attachments: ['fraction_worksheet.pdf']
  },
  {
    id: 'lp2',
    title: 'Plant Kingdom Classification',
    description: 'Exploring the diverse classification of plants',
    classId: 8,
    section: 'B',
    subjectId: 'sci_mid',
    teacherId: 'teacher2',
    dateCreated: '2023-04-02',
    dateRange: {
      start: '2023-04-11',
      end: '2023-04-25'
    },
    content: 'Week 1: Introduction to plant kingdom\nWeek 2: Classification criteria\nWeek 3: Major plant groups\nWeek 4: Adaptations and evolution',
    attachments: ['plant_classification.pdf', 'lab_activity.pdf']
  }
];

// Recorded Classes
export const recordedClasses: RecordedClass[] = [
  {
    id: 'rc1',
    title: 'Understanding Polynomials',
    description: 'Complete lesson on algebraic polynomials and their operations',
    classId: 9,
    section: 'B',
    subjectId: 'math_sec',
    teacherId: 'teacher1',
    dateRecorded: '2023-04-05',
    duration: 45,
    videoUrl: 'https://example.com/videos/math_polynomials.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/math_polynomials.jpg'
  },
  {
    id: 'rc2',
    title: 'Cell Structure and Functions',
    description: 'Detailed explanation of cell organelles and their functions',
    classId: 8,
    section: 'A',
    subjectId: 'sci_mid',
    teacherId: 'teacher3',
    dateRecorded: '2023-04-07',
    duration: 50,
    videoUrl: 'https://example.com/videos/science_cells.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/science_cells.jpg'
  }
];

// School Events
export const schoolEvents: SchoolEvent[] = [
  {
    id: 'event1',
    title: 'Annual Sports Day',
    description: 'Annual inter-house sports competition with various athletic events',
    startDateTime: '2023-12-10T09:00:00',
    endDateTime: '2023-12-10T16:00:00',
    location: 'School Playground',
    type: 'sports',
    createdBy: 'admin1',
    createdAt: '2023-11-01T10:30:00'
  },
  {
    id: 'event2',
    title: 'Half Yearly Examination',
    description: 'Mid-term assessment for all classes',
    startDateTime: '2023-09-15T09:00:00',
    endDateTime: '2023-09-25T15:00:00',
    location: 'Respective Classrooms',
    type: 'exam',
    forClasses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    createdBy: 'admin1',
    createdAt: '2023-08-20T11:15:00'
  },
  {
    id: 'event3',
    title: 'Diwali Holiday',
    description: 'School closed for Diwali celebration',
    startDateTime: '2023-11-10T00:00:00',
    endDateTime: '2023-11-15T23:59:59',
    location: 'School',
    type: 'holiday',
    createdBy: 'admin1',
    createdAt: '2023-10-01T09:00:00'
  },
  {
    id: 'event4',
    title: 'Science Exhibition',
    description: 'Annual science innovation showcase by students',
    startDateTime: '2023-08-25T10:00:00',
    endDateTime: '2023-08-26T16:00:00',
    location: 'School Auditorium',
    type: 'cultural',
    forClasses: [6, 7, 8, 9, 10],
    createdBy: 'teacher2',
    createdAt: '2023-07-15T14:20:00'
  }
];

// Exams
export const exams: Exam[] = [
  {
    id: 'exam1',
    name: 'First Unit Test',
    type: 'unit_test',
    startDate: '2023-07-10',
    endDate: '2023-07-15',
    maxMarks: 25,
    classesApplicable: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: 'exam2',
    name: 'Half Yearly Examination',
    type: 'half_yearly',
    startDate: '2023-09-15',
    endDate: '2023-09-25',
    maxMarks: 100,
    classesApplicable: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: 'exam3',
    name: 'Second Unit Test',
    type: 'unit_test',
    startDate: '2023-11-20',
    endDate: '2023-11-25',
    maxMarks: 25,
    classesApplicable: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: 'exam4',
    name: 'Final Examination',
    type: 'final',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    maxMarks: 100,
    classesApplicable: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }
];

// Student Results
export const studentResults: StudentResult[] = [
  {
    id: 'result1',
    studentId: 'student1',
    examId: 'exam1',
    subjectId: 'math_pri',
    marksObtained: 22,
    remarks: 'Excellent performance',
    teacherId: 'teacher1'
  },
  {
    id: 'result2',
    studentId: 'student1',
    examId: 'exam1',
    subjectId: 'eng_pri',
    marksObtained: 20,
    remarks: 'Good performance',
    teacherId: 'teacher3'
  },
  {
    id: 'result3',
    studentId: 'student2',
    examId: 'exam1',
    subjectId: 'sci_mid',
    marksObtained: 18,
    remarks: 'Good, but needs improvement in practical applications',
    teacherId: 'teacher2'
  }
];

// Study Materials
export const studyMaterials: StudyMaterial[] = [
  {
    id: 'sm1',
    title: 'Algebra Formulas and Concepts',
    description: 'Comprehensive guide to algebraic formulas and concepts for Class 8',
    classId: 8,
    section: 'All',
    subjectId: 'math_mid',
    teacherId: 'teacher1',
    dateUploaded: '2023-04-12',
    fileUrl: 'https://example.com/materials/algebra_formulas.pdf',
    fileType: 'pdf'
  },
  {
    id: 'sm2',
    title: 'English Grammar Workbook',
    description: 'Practice exercises for grammar improvement',
    classId: 5,
    section: 'All',
    subjectId: 'eng_pri',
    teacherId: 'teacher3',
    dateUploaded: '2023-04-14',
    fileUrl: 'https://example.com/materials/grammar_workbook.pdf',
    fileType: 'pdf'
  },
  {
    id: 'sm3',
    title: 'Chemical Reactions Presentation',
    description: 'Visual presentation on types of chemical reactions',
    classId: 9,
    section: 'All',
    subjectId: 'chem_sec',
    teacherId: 'teacher2',
    dateUploaded: '2023-04-18',
    fileUrl: 'https://example.com/materials/chemical_reactions.ppt',
    fileType: 'ppt'
  }
];

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalStudents: 450,
  totalTeachers: 35,
  totalClasses: 30,
  upcomingEvents: 5,
  attendanceToday: {
    present: 430,
    absent: 20,
    percentage: 95.56
  }
};

// User authentication mock data
export const users = [
  ...admins.map(admin => ({ id: admin.id, email: admin.email, password: 'admin123', role: 'admin' })),
  ...teachers.map(teacher => ({ id: teacher.id, email: teacher.email, password: 'teacher123', role: 'teacher' })),
  ...students.map(student => ({ id: student.id, email: student.email, password: 'student123', role: 'student' }))
];

// Helper function to find user by credentials
export const findUserByCredentials = (email: string, password: string) => {
  return users.find(user => user.email === email && user.password === password);
};

// Helper function to get user profile by id and role
export const getUserProfile = (id: string, role: string) => {
  switch (role) {
    case 'admin':
      return admins.find(admin => admin.id === id);
    case 'teacher':
      return teachers.find(teacher => teacher.id === id);
    case 'student':
      return students.find(student => student.id === id);
    default:
      return null;
  }
};
