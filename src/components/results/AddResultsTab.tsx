
import React from 'react';
import { Student, Subject, Exam } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Users } from 'lucide-react';

interface AddResultsTabProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedSection: string;
  setSelectedSection: (value: string) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedExam: string;
  setSelectedExam: (value: string) => void;
  selectedStudent: string;
  setSelectedStudent: (value: string) => void;
  marksObtained: string;
  setMarksObtained: (value: string) => void;
  remarks: string;
  setRemarks: (value: string) => void;
  maxMarks: number;
  classOptions: { id: string; name: string }[];
  sectionOptions: string[];
  subjectOptions: Subject[];
  examOptions: Exam[];
  studentOptions: Student[];
  handleAddResult: () => void;
}

const AddResultsTab: React.FC<AddResultsTabProps> = ({
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
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Result</CardTitle>
          <CardDescription>Record a student's examination result</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Class, Subject, Student Selections */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-class">Class</Label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger id="add-class">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          Class {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-section">Section</Label>
                  <Select
                    value={selectedSection}
                    onValueChange={setSelectedSection}
                    disabled={!selectedClass || sectionOptions.length === 0}
                  >
                    <SelectTrigger id="add-section">
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionOptions.map((section) => (
                        <SelectItem key={section} value={section}>
                          Section {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-subject">Subject</Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                  disabled={!selectedClass || !selectedSection || subjectOptions.length === 0}
                >
                  <SelectTrigger id="add-subject">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-examination">Examination</Label>
                <Select
                  value={selectedExam}
                  onValueChange={setSelectedExam}
                  disabled={!selectedClass || examOptions.length === 0}
                >
                  <SelectTrigger id="add-examination">
                    <SelectValue placeholder="Select Examination" />
                  </SelectTrigger>
                  <SelectContent>
                    {examOptions.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name} (Max: {exam.maxMarks})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-student">Student</Label>
                <Select
                  value={selectedStudent}
                  onValueChange={setSelectedStudent}
                  disabled={!selectedClass || !selectedSection || studentOptions.length === 0}
                >
                  <SelectTrigger id="add-student">
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentOptions.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.rollNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column - Marks and Remarks */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="marks-obtained">Marks Obtained</Label>
                  <span className="text-sm text-gray-500">/ {maxMarks}</span>
                </div>
                <Input
                  id="marks-obtained"
                  type="number"
                  min="0"
                  max={maxMarks}
                  placeholder="Enter marks"
                  value={marksObtained}
                  onChange={(e) => setMarksObtained(e.target.value)}
                  disabled={!selectedExam}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  placeholder="Enter remarks or feedback"
                  className="min-h-[120px]"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAddResult}
            disabled={!selectedClass || !selectedSection || !selectedSubject || !selectedExam || !selectedStudent || !marksObtained}
          >
            Save Result
          </Button>
        </CardFooter>
      </Card>

      {/* Students List - ALWAYS SHOWN WHEN CLASS & SECTION SELECTED */}
      {selectedClass && selectedSection && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students List
            </CardTitle>
            <CardDescription>
              List of students in Class {selectedClass.replace('class', '')} Section {selectedSection}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentOptions.length > 0 ? (
                    studentOptions.map((student) => (
                      <TableRow 
                        key={student.id}
                        className={selectedStudent === student.id ? "bg-muted" : ""}
                      >
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={selectedStudent === student.id ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setSelectedStudent(student.id)}
                          >
                            {selectedStudent === student.id && <Check className="mr-1 h-4 w-4" />}
                            {selectedStudent === student.id ? "Selected" : "Select"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No students found for this class and section
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddResultsTab;
