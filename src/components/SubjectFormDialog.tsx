
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Subject } from '@/types';

interface SubjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subject: Omit<Subject, 'id'>) => void;
  editSubject?: Subject;
}

const SubjectFormDialog = ({ open, onOpenChange, onSave, editSubject }: SubjectFormDialogProps) => {
  const [name, setName] = useState(editSubject?.name || '');
  const [code, setCode] = useState(editSubject?.code || '');
  const [classesApplicable, setClassesApplicable] = useState(
    editSubject?.classesApplicable.join(',') || ''
  );
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }

    if (!code.trim()) {
      setError('Subject code is required');
      return;
    }

    if (!classesApplicable.trim()) {
      setError('At least one applicable class is required');
      return;
    }

    try {
      const classes = classesApplicable.split(',')
        .map(c => c.trim())
        .filter(c => c)
        .map(c => parseInt(c, 10));

      if (classes.some(isNaN)) {
        throw new Error('Invalid class numbers');
      }

      if (classes.length === 0) {
        setError('At least one applicable class is required');
        return;
      }

      onSave({
        name,
        code,
        classesApplicable: classes,
      });

      // Reset form
      setName('');
      setCode('');
      setClassesApplicable('');
      setError('');
      onOpenChange(false);
    } catch (error) {
      setError('Invalid class numbers. Use comma-separated numbers (e.g. 1,2,3)');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
          <DialogDescription>
            {editSubject
              ? 'Modify subject details'
              : 'Create a new subject. Use comma-separated values for classes (e.g. 1,2,3).'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subjectName" className="text-right">
              Name
            </Label>
            <Input
              id="subjectName"
              placeholder="Subject name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subjectCode" className="text-right">
              Code
            </Label>
            <Input
              id="subjectCode"
              placeholder="Subject code"
              className="col-span-3"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="applicableClasses" className="text-right">
              Classes
            </Label>
            <Input
              id="applicableClasses"
              placeholder="e.g. 1,2,3,4,5"
              className="col-span-3"
              value={classesApplicable}
              onChange={(e) => setClassesApplicable(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectFormDialog;
