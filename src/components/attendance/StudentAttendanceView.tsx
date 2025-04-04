import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AttendanceRecord, Student } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, CalendarIcon } from 'lucide-react';

interface StudentAttendanceViewProps {
  attendanceRecords: AttendanceRecord[];
}

const StudentAttendanceView = ({ attendanceRecords }: StudentAttendanceViewProps) => {
  const { user } = useAuth();
  const currentStudent = user as Student;

  if (!currentStudent) return null;
  
  // Filter records for student view
  const getStudentAttendanceRecords = () => {
    // Return all records where the student's class and section match
    return attendanceRecords.filter(record => 
      record.classId === currentStudent.class && 
      record.section === currentStudent.section
    );
  };

  // Check if the current student was present in a given record
  const wasStudentPresent = (record: AttendanceRecord): boolean => {
    return record.presentStudents.includes(currentStudent.id);
  };

  const studentRecords = getStudentAttendanceRecords();
  
  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    // This is a placeholder - in a real implementation you would access the subject data
    // For the refactoring, we're keeping this function simple
    return subjectId ? `Subject ${subjectId}` : 'Unknown Subject';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">My Attendance</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Attendance Records</CardTitle>
          <CardDescription>
            Class {currentStudent.class} - Section {currentStudent.section}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getSubjectName(record.subjectId)}</TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          wasStudentPresent(record) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {wasStudentPresent(record) 
                          ? <Check className="mr-1 h-3 w-3" /> 
                          : <X className="mr-1 h-3 w-3" />}
                        {wasStudentPresent(record) ? 'Present' : 'Absent'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-6">
              <CalendarIcon className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">No attendance records available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendanceView;
