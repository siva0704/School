
import React from 'react';
import { Teacher, Student, Subject } from '@/types';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Users } from 'lucide-react';

interface TeacherAssignmentsSummaryProps {
  teacherAssignments: {
    classId: number;
    section: string;
    subjectId: string;
  }[];
  role: string;
  classes: {
    id: string;
    name: string;
    sections: { id: string; name: string; }[];
  }[];
  allSubjects: Subject[];
  allStudents: Student[];
  onAddResults: (classId: string, section: string) => void;
}

const TeacherAssignmentsSummary: React.FC<TeacherAssignmentsSummaryProps> = ({
  teacherAssignments,
  role,
  classes,
  allSubjects,
  allStudents,
  onAddResults
}) => {
  if (role !== 'teacher' || teacherAssignments.length === 0) return null;
  
  // Group assignments by class and section
  const groupedAssignments: Record<string, {
    classId: number;
    className: string;
    section: string;
    subjects: { id: string; name: string }[];
  }> = {};
  
  teacherAssignments.forEach(assignment => {
    const key = `${assignment.classId}-${assignment.section}`;
    const className = classes.find(c => parseInt(c.id, 10) === assignment.classId)?.name || '';
    const subject = allSubjects.find(s => s.id === assignment.subjectId);
    
    if (!groupedAssignments[key] && subject) {
      groupedAssignments[key] = {
        classId: assignment.classId,
        className,
        section: assignment.section,
        subjects: [{ id: subject.id, name: subject.name }]
      };
    } else if (subject) {
      groupedAssignments[key].subjects.push({ id: subject.id, name: subject.name });
    }
  });
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Your Assigned Classes</CardTitle>
        <CardDescription>
          Classes and sections you are teaching
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(groupedAssignments).map((group, index) => (
            <Card key={index} className="bg-muted/50">
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Class {group.className} - Section {group.section}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Subjects:</span>
                  </div>
                  <div className="flex flex-wrap gap-1 ml-6">
                    {group.subjects.map(subject => (
                      <Badge key={subject.id} variant="outline" className="text-xs">
                        {subject.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center mt-2">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Students:</span>
                    <span className="text-sm ml-2">
                      {allStudents.filter(s => 
                        s.class === group.classId && 
                        s.section === group.section
                      ).length}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => onAddResults(group.classId.toString(), group.section)}
                >
                  Add Results
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherAssignmentsSummary;
