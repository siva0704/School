
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Users, CalendarIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AttendanceRecord, ClassData, Subject } from '@/types';

interface AttendanceRecordsViewProps {
  classOptions: ClassData[];
  sectionOptions: string[];
  subjectOptions: Subject[];
  selectedClass: string;
  selectedSection: string;
  selectedSubject: string;
  attendanceRecords: AttendanceRecord[];
  setSelectedClass: (value: string) => void;
  setSelectedSection: (value: string) => void;
  setSelectedSubject: (value: string) => void;
  getSubjectName: (subjectId: string) => string;
}

const AttendanceRecordsView = ({
  classOptions,
  sectionOptions,
  subjectOptions,
  selectedClass,
  selectedSection,
  selectedSubject,
  attendanceRecords,
  setSelectedClass,
  setSelectedSection,
  setSelectedSubject,
  getSubjectName
}: AttendanceRecordsViewProps) => {
  const { role } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
        <CardDescription>View and manage attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="view-class">Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger id="view-class">
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
            <Label htmlFor="view-section">Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger id="view-section">
                <SelectValue placeholder="Select Section" />
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
                    {role === 'teacher' ? "No assigned sections for this class" : "No sections available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="view-subject">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="view-subject">
                <SelectValue placeholder="Select Subject" />
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
                    {role === 'teacher' ? "No assigned subjects for this class" : "No subjects available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {attendanceRecords.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Attendance %</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => {
                const totalStudents = record.presentStudents.length + record.absentStudents.length;
                const attendancePercentage = Math.round((record.presentStudents.length / totalStudents) * 100);
                
                return (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>Class {record.classId}{record.section}</TableCell>
                    <TableCell>{getSubjectName(record.subjectId)}</TableCell>
                    <TableCell className="text-center">{record.presentStudents.length}</TableCell>
                    <TableCell className="text-center">{record.absentStudents.length}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-0.5 rounded-full ${
                        attendancePercentage >= 90 ? 'bg-green-100 text-green-800' :
                        attendancePercentage >= 80 ? 'bg-blue-100 text-blue-800' :
                        attendancePercentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {attendancePercentage}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center border rounded-md p-8">
            <CalendarIcon className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-lg font-medium mb-1">No Records Found</p>
            <p className="text-gray-500 text-center max-w-md">
              {!selectedClass || !selectedSection || !selectedSubject
                ? "Please select class, section, and subject to view attendance records."
                : "No attendance records found for the selected criteria."}
            </p>
          </div>
        )}
      </CardContent>
      {attendanceRecords.length > 0 && (
        <CardFooter className="flex justify-end">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AttendanceRecordsView;
