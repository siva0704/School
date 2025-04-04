
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Eye, Search } from 'lucide-react';
import { StudentResult, Subject, Exam } from '@/types';

interface StudentResultsViewProps {
  studentId: string;
  className: number;
  section: string;
  allSubjects: Subject[];
  exams: Exam[];
  results: StudentResult[];
  getSubjectName: (subjectId: string) => string;
  getExamName: (examId: string) => string;
  getExamMaxMarks: (examId: string) => number;
}

const StudentResultsView: React.FC<StudentResultsViewProps> = ({
  studentId,
  className,
  section,
  allSubjects,
  exams,
  results,
  getSubjectName,
  getExamName,
  getExamMaxMarks,
}) => {
  const [selectedExam, setSelectedExam] = useState('all-exams');
  const [selectedSubject, setSelectedSubject] = useState('all-subjects');

  // Filter subjects applicable to the student's class
  const classSubjects = allSubjects.filter(subject => 
    subject.classesApplicable.includes(className)
  );
  
  // Filter exams applicable to the student's class
  const classExams = exams.filter(exam => 
    exam.classesApplicable.includes(className)
  );
  
  // Filter results based on selected exam and subject
  const filteredResults = results.filter(result => {
    const examMatch = selectedExam === 'all-exams' || result.examId === selectedExam;
    const subjectMatch = selectedSubject === 'all-subjects' || result.subjectId === selectedSubject;
    return examMatch && subjectMatch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Results</CardTitle>
        <CardDescription>View your academic performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="filter-subject">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="filter-subject">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-subjects">All Subjects</SelectItem>
                {classSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-exam">Examination</Label>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger id="filter-exam">
                <SelectValue placeholder="Select Examination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-exams">All Exams</SelectItem>
                {classExams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Table */}
        {filteredResults.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Examination</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Marks</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => {
                const examMaxMarks = getExamMaxMarks(result.examId);
                const percentage = (result.marksObtained / examMaxMarks) * 100;

                return (
                  <TableRow key={result.id}>
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
              {results.length === 0 ? 
                "You don't have any results recorded yet." : 
                "No results match the selected filters."
              }
            </p>
          </div>
        )}
      </CardContent>
      {filteredResults.length > 0 && (
        <CardFooter className="flex justify-end">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Results
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default StudentResultsView;
