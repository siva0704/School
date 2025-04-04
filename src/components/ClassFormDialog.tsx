
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
import { ClassData, Section } from '@/types';

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (classData: Omit<ClassData, 'id'>) => void;
  editClass?: ClassData;
}

const ClassFormDialog = ({ open, onOpenChange, onSave, editClass }: ClassFormDialogProps) => {
  const [className, setClassName] = useState(editClass?.name || '');
  const [sections, setSections] = useState(editClass?.sections.map(s => s.name).join(',') || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!className.trim()) {
      setError('Class name is required');
      return;
    }

    if (!sections.trim()) {
      setError('At least one section is required');
      return;
    }

    const sectionsList: Section[] = sections.split(',')
      .map(section => section.trim())
      .filter(section => section)
      .map(section => ({
        id: `${className}${section}`,
        name: section,
      }));

    if (sectionsList.length === 0) {
      setError('Invalid sections format. Use comma-separated values (e.g. A,B,C)');
      return;
    }

    onSave({
      name: className,
      sections: sectionsList,
    });

    // Reset form
    setClassName('');
    setSections('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
          <DialogDescription>
            {editClass 
              ? 'Modify class details and sections'
              : 'Create a new class with sections. Use comma-separated values for sections (e.g. A,B,C).'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="className" className="text-right">
              Class
            </Label>
            <Input
              id="className"
              placeholder="Enter class (e.g. 1, 2)"
              className="col-span-3"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sections" className="text-right">
              Sections
            </Label>
            <Input
              id="sections"
              placeholder="e.g. A,B,C"
              className="col-span-3"
              value={sections}
              onChange={(e) => setSections(e.target.value)}
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

export default ClassFormDialog;
