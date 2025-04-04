
import React from 'react';
import { Student, Exam, StudentResult, Subject } from '@/types';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Download, Eye, Search } from 'lucide-react';

interface ViewResultsTabProps {
  selectedViewClass: string;
  setSelectedViewClass: (value: string) => void;
  selectedViewSection: string;
  setSelectedViewSection: (value: string) => void;
  selectedViewExam: string;
  setSelectedViewExam: (value: string) => void;
  selectedViewStudent: string;
  setSelectedViewStudent: (value: string) => void;
  selectedViewSubject: string;
  setSelectedViewSubject: (value: string) => void;
  results: StudentResult[];
  classOptions: { id: string; name: string }[];
  sectionOptions: string[];
  subjectOptions: Subject[];
  examOptions: Exam[];
  studentOptions: Student[];
  getStudentName: (studentId: string) => string;
  getSubjectName: (subjectId: string) => string;
  getExamName: (examId: string) => string;
  getExamMaxMarks: (examId: string) => number;
}

const ViewResultsTab: React.FC<ViewResultsTabProps> = ({
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
  classOptions,
  sectionOptions,
  subjectOptions,
  examOptions,
  studentOptions,
  getStudentName,
  getSubjectName,
  getExamName,
  getExamMaxMarks,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>View and download student results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="view-class">Class</Label>
            <Select
              value={selectedViewClass}
              onValueChange={setSelectedViewClass}
            >
              <SelectTrigger id="view-class">
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
            <Label htmlFor="view-section">Section</Label>
            <Select
              value={selectedViewSection}
              onValueChange={setSelectedViewSection}
              disabled={!selectedViewClass || sectionOptions.length === 0}
            >
              <SelectTrigger id="view-section">
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

          <div className="space-y-2">
            <Label htmlFor="view-subject">Subject</Label>
            <Select
              value={selectedViewSubject}
              onValueChange={setSelectedViewSubject}
              disabled={!selectedViewClass || subjectOptions.length === 0}
            >
              <SelectTrigger id="view-subject">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-subjects">All Subjects</SelectItem>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-exam">Examination</Label>
            <Select
              value={selectedViewExam}
              onValueChange={setSelectedViewExam}
              disabled={!selectedViewClass || examOptions.length === 0}
            >
              <SelectTrigger id="view-exam">
                <SelectValue placeholder="Select Examination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-exams">All Exams</SelectItem>
                {examOptions.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-student">Student</Label>
            <Select
              value={selectedViewStudent}
              onValueChange={setSelectedViewStudent}
              disabled={!selectedViewClass || !selectedViewSection || studentOptions.length === 0}
            >
              <SelectTrigger id="view-student">
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-students">All Students</SelectItem>
                {studentOptions.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.rollNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Table */}
        {results.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Examination</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Marks</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => {
                const examMaxMarks = getExamMaxMarks(result.examId);
                const percentage = (result.marksObtained / examMaxMarks) * 100;

                return (
                  <TableRow key={result.id}>
                    <TableCell>{getStudentName(result.studentId)}</TableCell>
                    <TableCell>{getExamName(result.examId)}</TableCell>
                    <TableCell>{getSubjectName(result.subjectId)}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={
                        percentage >= 75 ? "bg-green-100 text-green-800 hover:bg-green-100" :
                        percentage >= 60 ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                        percentage >= 33 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                        "bg-red-100 text-red-800 hover:bg-red-100"
                      }>
                        {result.marksObtained} / {examMaxMarks} ({Math.round(percentage)}%)
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {result.remarks || <span className="text-gray-400">No remarks</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="border rounded-md p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Results Found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {!selectedViewClass || !selectedViewSection
                ? "Please select a class and section to view results."
                : "No results match the selected criteria."}
            </p>
          </div>
        )}
      </CardContent>
      {results.length > 0 && (
        <CardFooter className="flex justify-end">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ViewResultsTab;
