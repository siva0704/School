
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, AlertCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClassData, Section, Student, Subject, UserRole } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AttendanceFormProps {
  classOptions: ClassData[];
  sectionOptions: string[];
  subjectOptions: Subject[];
  studentOptions: Student[];
  selectedClass: string;
  selectedSection: string;
  selectedSubject: string;
  selectedDate: Date;
  attendingStudents: Record<string, boolean>;
  setSelectedClass: (value: string) => void;
  setSelectedSection: (value: string) => void;
  setSelectedSubject: (value: string) => void;
  setSelectedDate: (value: Date) => void;
  setAttendingStudents: (value: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  onSubmit: () => void;
  isAssigned?: boolean;
  role: UserRole | null;
}

const AttendanceForm = ({
  classOptions,
  sectionOptions,
  subjectOptions,
  studentOptions,
  selectedClass,
  selectedSection,
  selectedSubject,
  selectedDate,
  attendingStudents,
  setSelectedClass,
  setSelectedSection,
  setSelectedSubject,
  setSelectedDate,
  setAttendingStudents,
  onSubmit,
  isAssigned = true,
  role
}: AttendanceFormProps) => {
  const { teacherAssignments } = useAuth();
  const isFormDisabled = !selectedClass || !selectedSection || !selectedSubject || studentOptions.length === 0 || (role === 'teacher' && !isAssigned);
  
  // Debug log to check what's being passed to the component
  console.log('AttendanceForm props:', { 
    role, 
    isAssigned,
    classOptions, 
    sectionOptions, 
    subjectOptions, 
    teacherAssignments 
  });

  // Quick attendance actions
  const markAllPresent = () => {
    const allPresent: Record<string, boolean> = {};
    studentOptions.forEach(student => {
      allPresent[student.id] = true;
    });
    setAttendingStudents(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent: Record<string, boolean> = {};
    studentOptions.forEach(student => {
      allAbsent[student.id] = false;
    });
    setAttendingStudents(allAbsent);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
        <CardDescription>Record student attendance for today or a selected date</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {role === 'teacher' && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Teacher Access</AlertTitle>
            <AlertDescription>
              You can only mark attendance for classes, sections, and subjects assigned to you.
            </AlertDescription>
          </Alert>
        )}
        
        {role === 'teacher' && selectedClass && selectedSection && selectedSubject && !isAssigned && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Not Assigned</AlertTitle>
            <AlertDescription>
              You are not assigned to this combination of class, section, and subject. You cannot mark attendance.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.length > 0 ? (
                  classOptions.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      Class {classItem.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-class" disabled>
                    {role === 'teacher' ? "No assigned classes" : "No classes available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass}>
              <SelectTrigger id="section">
                <SelectValue placeholder={!selectedClass ? "Select class first" : "Select Section"} />
              </SelectTrigger>
              <SelectContent>
                {sectionOptions.length > 0 ? (
                  sectionOptions.map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-section" disabled>
                    {!selectedClass
                      ? "Select class first"
                      : role === 'teacher'
                        ? "No assigned sections for this class"
                        : "No sections available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass || !selectedSection}>
              <SelectTrigger id="subject">
                <SelectValue placeholder={!selectedClass || !selectedSection ? "Select class and section first" : "Select Subject"} />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.length > 0 ? (
                  subjectOptions.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-subject" disabled>
                    {!selectedClass || !selectedSection
                      ? "Select class and section first"
                      : role === 'teacher'
                        ? "No assigned subjects for this class and section"
                        : "No subjects available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Label className="mb-2 block">Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="border rounded-md p-3"
            />
          </div>
          
          <div className="md:w-2/3">
            <div className="flex justify-between items-center mb-2">
              <Label>Students</Label>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500 mr-2">
                  {Object.values(attendingStudents).filter(Boolean).length} / {Object.values(attendingStudents).length} Present
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={studentOptions.length === 0}>
                      Quick Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={markAllPresent}>
                      Mark All Present
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={markAllAbsent}>
                      Mark All Absent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {studentOptions.length > 0 ? (
              <div className="border rounded-md h-[300px] overflow-y-auto p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentOptions.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Label
                              htmlFor={`present-${student.id}`}
                              className={`px-2 py-1 rounded-md cursor-pointer ${
                                attendingStudents[student.id] ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                              }`}
                              onClick={() => setAttendingStudents(prev => ({ ...prev, [student.id]: true }))}
                            >
                              <div className="flex items-center">
                                <Check className="mr-1 h-4 w-4" />
                                Present
                              </div>
                            </Label>
                            <Label
                              htmlFor={`absent-${student.id}`}
                              className={`px-2 py-1 rounded-md cursor-pointer ${
                                !attendingStudents[student.id] ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                              }`}
                              onClick={() => setAttendingStudents(prev => ({ ...prev, [student.id]: false }))}
                            >
                              <div className="flex items-center">
                                <X className="mr-1 h-4 w-4" />
                                Absent
                              </div>
                            </Label>
                            <div className="sr-only">
                              <input
                                type="radio"
                                id={`present-${student.id}`}
                                name={`attendance-${student.id}`}
                                checked={attendingStudents[student.id] === true}
                                onChange={() => setAttendingStudents(prev => ({
                                  ...prev,
                                  [student.id]: true
                                }))}
                              />
                              <input
                                type="radio"
                                id={`absent-${student.id}`}
                                name={`attendance-${student.id}`}
                                checked={attendingStudents[student.id] === false}
                                onChange={() => setAttendingStudents(prev => ({
                                  ...prev,
                                  [student.id]: false
                                }))}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="border rounded-md p-8 flex items-center justify-center h-[300px]">
                <p className="text-gray-500">
                  {!selectedClass 
                    ? "Please select class to view students."
                    : !selectedSection
                    ? "Please select section to view students."
                    : "No students found for the selected class and section."}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          className="w-full md:w-auto"
          onClick={onSubmit}
          disabled={isFormDisabled}
        >
          Submit Attendance
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AttendanceForm;
