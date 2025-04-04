
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, CalendarIcon, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { schoolEvents } from '@/data/mock-data';
import { Student } from '@/types';

const EventsPage = () => {
  const { role, user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  
  // Get student data if role is student
  const studentData = role === 'student' ? user as Student : null;

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Filter events based on type and student class
  const filteredEvents = schoolEvents
    .filter(event => {
      // First filter by event type
      if (selectedEventType === "all") return true;
      return event.type === selectedEventType;
    })
    .filter(event => {
      // Then filter by student class if applicable
      if (role === 'student' && studentData && event.forClasses) {
        return event.forClasses.includes(studentData.class);
      }
      return true;
    });

  // Get events for selected date
  const eventsForSelectedDate = date ? getEventsForDate(date) : [];

  const handleAddEvent = () => {
    toast({
      title: "Event Added",
      description: "New event has been added successfully.",
    });
    setIsAddEventDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">Events & Calendar</h2>
        
        {role === 'admin' && (
          <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new school event. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <label htmlFor="title" className="block mb-2 text-sm font-medium">
                    Event Title
                  </label>
                  <Input id="title" placeholder="Enter event title" />
                </div>
                
                <div>
                  <label htmlFor="type" className="block mb-2 text-sm font-medium">
                    Event Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block mb-2 text-sm font-medium">
                    Description
                  </label>
                  <Textarea id="description" placeholder="Enter event description" />
                </div>
                
                <div>
                  <label htmlFor="location" className="block mb-2 text-sm font-medium">
                    Location
                  </label>
                  <Input id="location" placeholder="Enter location" />
                </div>
                
                <div>
                  <label htmlFor="start-date" className="block mb-2 text-sm font-medium">
                    Start Date & Time
                  </label>
                  <div className="flex gap-2">
                    <Input type="datetime-local" id="start-date" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="end-date" className="block mb-2 text-sm font-medium">
                    End Date & Time
                  </label>
                  <div className="flex gap-2">
                    <Input type="datetime-local" id="end-date" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="classes" className="block mb-2 text-sm font-medium">
                    Applicable Classes
                  </label>
                  <Input id="classes" placeholder="e.g. 1,2,3 (Leave empty for all)" />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>Add Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                Click on a date to view events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant={selectedEventType === 'all' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setSelectedEventType('all')}
                >
                  All Events
                </Button>
                <Button 
                  variant={selectedEventType === 'sports' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setSelectedEventType('sports')}
                >
                  Sports Events
                </Button>
                <Button 
                  variant={selectedEventType === 'cultural' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setSelectedEventType('cultural')}
                >
                  Cultural Events
                </Button>
                <Button 
                  variant={selectedEventType === 'exam' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setSelectedEventType('exam')}
                >
                  Exams
                </Button>
                <Button 
                  variant={selectedEventType === 'holiday' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setSelectedEventType('holiday')}
                >
                  Holidays
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {date 
                  ? `Events for ${format(date, 'MMMM d, yyyy')}` 
                  : 'Select a date'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDate.map(event => (
                    <div 
                      key={event.id} 
                      className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {event.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>
                            {format(new Date(event.startDateTime), 'h:mm a')} - {format(new Date(event.endDateTime), 'h:mm a')}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <CalendarIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500">No events for this date</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                {selectedEventType === 'all' 
                  ? 'All upcoming events' 
                  : `Upcoming ${selectedEventType} events`
                }
                {role === 'student' && studentData ? ' for your class' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.slice(0, 5).map(event => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {event.title}
                        <div className="text-xs text-gray-500 mt-1">
                          {event.description.substring(0, 50)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(event.startDateTime), 'MMM d, yyyy')}
                        <div className="text-xs text-gray-500">
                          {format(new Date(event.startDateTime), 'h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                          {event.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        {event.location || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredEvents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No events found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
