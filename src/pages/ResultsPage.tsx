
import { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

import { useAuth } from '@/contexts/AuthContext';
import { classes, subjects, teachers, students, exams, studentResults } from '@/data/mock-data';
import { Student, Subject, Exam, StudentResult } from '@/types';
import AddResultsTab from '@/components/results/AddResultsTab';
import ViewResultsTab from '@/components/results/ViewResultsTab';
import TeacherAssignmentsSummary from '@/components/results/TeacherAssignmentsSummary';
import { useResultsPage } from '@/hooks/useResultsPage';
import StudentResultsView from '@/components/results/StudentResultsView';

// Helper function to get all subjects across all categories
const getAllSubjects = () => {
  const allSubjectsArray: Subject[] = [];
  
  Object.values(subjects).forEach(categorySubjects => {
    categorySubjects.forEach(subject => {
      allSubjectsArray.push(subject);
    });
  });
  
  return allSubjectsArray;
};

const ResultsPage = () => {
  const { role, user } = useAuth();
  const { toast } = useToast();
  const allSubjects = getAllSubjects();
  
  // Use the custom hook to handle the complex state management
  const {
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
  } = useResultsPage({
    teachers,
    classes,
    allSubjects,
    exams,
    allStudents: students,
    studentResults,
  });

  // Helper functions to get names by IDs
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.name} (${student.rollNumber})` : 'Unknown Student';
  };
  
  const getSubjectName = (subjectId: string) => {
    const subject = allSubjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };
  
  const getExamName = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.name : 'Unknown Exam';
  };
  
  const getExamMaxMarks = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.maxMarks : 0;
  };

  // If the user is a student, we only show their results
  if (role === 'student' && user) {
    const studentUser = user as Student;
    return (
      <StudentResultsView 
        studentId={user.id}
        className={studentUser.class}
        section={studentUser.section}
        allSubjects={allSubjects}
        exams={exams}
        results={studentResults.filter(result => result.studentId === user.id)}
        getSubjectName={getSubjectName}
        getExamName={getExamName}
        getExamMaxMarks={getExamMaxMarks}
      />
    );
  }

  return (
    <div>
      {/* Show teacher assignments summary for teachers */}
      {role === 'teacher' && (
        <TeacherAssignmentsSummary 
          teacherAssignments={teacherAssignments}
          role={role}
          classes={classes}
          allSubjects={allSubjects}
          allStudents={students}
          onAddResults={handleTeacherAddResults}
        />
      )}
      
      <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Results</TabsTrigger>
          <TabsTrigger value="add">Add Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <ViewResultsTab 
            selectedViewClass={selectedViewClass}
            setSelectedViewClass={setSelectedViewClass}
            selectedViewSection={selectedViewSection}
            setSelectedViewSection={setSelectedViewSection}
            selectedViewExam={selectedViewExam}
            setSelectedViewExam={setSelectedViewExam}
            selectedViewStudent={selectedViewStudent}
            setSelectedViewStudent={setSelectedViewStudent}
            selectedViewSubject={selectedViewSubject}
            setSelectedViewSubject={setSelectedViewSubject}
            results={results}
            classOptions={classOptions}
            sectionOptions={sectionOptions}
            subjectOptions={subjectOptions}
            examOptions={examOptions}
            studentOptions={studentOptions}
            getStudentName={getStudentName}
            getSubjectName={getSubjectName}
            getExamName={getExamName}
            getExamMaxMarks={getExamMaxMarks}
          />
        </TabsContent>
        
        <TabsContent value="add">
          <AddResultsTab 
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedExam={selectedExam}
            setSelectedExam={setSelectedExam}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            marksObtained={marksObtained}
            setMarksObtained={setMarksObtained}
            remarks={remarks}
            setRemarks={setRemarks}
            maxMarks={maxMarks}
            classOptions={classOptions}
            sectionOptions={sectionOptions}
            subjectOptions={subjectOptions}
            examOptions={examOptions}
            studentOptions={studentOptions}
            handleAddResult={handleAddResult}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsPage;
