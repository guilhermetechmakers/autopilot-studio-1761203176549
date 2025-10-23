/**
 * Calendar Booking Widget for Intake Forms
 * Integrates with calendar APIs for meeting scheduling
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  available: boolean;
  timezone: string;
}

interface CalendarBookingProps {
  intakeFormId?: string;
  onBookingComplete?: (bookingId: string) => void;
  className?: string;
}

export function CalendarBooking({ onBookingComplete, className }: CalendarBookingProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    meetingType: 'intake',
    notes: ''
  });

  // Available time slots (in production, this would come from calendar API)
  const availableSlots: TimeSlot[] = [
    { id: '1', start: '09:00', end: '09:30', available: true, timezone: 'UTC' },
    { id: '2', start: '09:30', end: '10:00', available: true, timezone: 'UTC' },
    { id: '3', start: '10:00', end: '10:30', available: true, timezone: 'UTC' },
    { id: '4', start: '10:30', end: '11:00', available: false, timezone: 'UTC' },
    { id: '5', start: '11:00', end: '11:30', available: true, timezone: 'UTC' },
    { id: '6', start: '11:30', end: '12:00', available: true, timezone: 'UTC' },
    { id: '7', start: '14:00', end: '14:30', available: true, timezone: 'UTC' },
    { id: '8', start: '14:30', end: '15:00', available: true, timezone: 'UTC' },
    { id: '9', start: '15:00', end: '15:30', available: false, timezone: 'UTC' },
    { id: '10', start: '15:30', end: '16:00', available: true, timezone: 'UTC' },
    { id: '11', start: '16:00', end: '16:30', available: true, timezone: 'UTC' },
    { id: '12', start: '16:30', end: '17:00', available: true, timezone: 'UTC' },
  ];

  // Get next 7 days
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        fullDate: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    }
    return days;
  };

  const days = getNextDays();

  useEffect(() => {
    if (selectedDate) {
      // In production, fetch available slots for selected date
      setTimeSlots(availableSlots);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (timeId: string) => {
    setSelectedTime(timeId);
  };

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsBooking(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingId = `booking_${Date.now()}`;
      onBookingComplete?.(bookingId);
      
      // Show success message
      console.log('Booking created:', {
        id: bookingId,
        date: selectedDate,
        time: timeSlots.find(slot => slot.id === selectedTime),
        details: bookingDetails
      });
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const selectedTimeSlot = timeSlots.find(slot => slot.id === selectedTime);
  const selectedDay = days.find(day => day.date === selectedDate);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-900">Schedule Your Intake Call</CardTitle>
              <CardDescription className="text-blue-700">
                Choose a convenient time for your project consultation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Select Date
            </CardTitle>
            <CardDescription>
              Choose your preferred date for the intake call
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {days.map((day) => (
                <Button
                  key={day.date}
                  variant={selectedDate === day.date ? 'default' : 'outline'}
                  onClick={() => handleDateSelect(day.date)}
                  className="h-auto p-3 flex flex-col items-center"
                >
                  <span className="font-medium">{day.label}</span>
                  <span className="text-xs opacity-70">
                    {day.date.split('-')[2]}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Select Time
            </CardTitle>
            <CardDescription>
              {selectedDate ? 'Choose your preferred time slot' : 'Please select a date first'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedTime === slot.id ? 'default' : 'outline'}
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.id)}
                    className="h-10 text-sm"
                  >
                    {slot.start} - {slot.end}
                    {!slot.available && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Booked
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Select a date to view available times</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Details */}
      {(selectedDate && selectedTime) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Details</CardTitle>
            <CardDescription>
              Confirm your meeting details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Meeting Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Meeting Summary</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{selectedDay?.fullDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedTimeSlot?.start} - {selectedTimeSlot?.end} UTC</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>Video call (Zoom link will be sent)</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="booking_name">Full Name *</Label>
                <Input
                  id="booking_name"
                  value={bookingDetails.name}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking_email">Email Address *</Label>
                <Input
                  id="booking_email"
                  type="email"
                  value={bookingDetails.email}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking_phone">Phone Number</Label>
                <Input
                  id="booking_phone"
                  value={bookingDetails.phone}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking_company">Company</Label>
                <Input
                  id="booking_company"
                  value={bookingDetails.company}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_type">Meeting Type</Label>
              <Select 
                value={bookingDetails.meetingType}
                onValueChange={(value) => setBookingDetails(prev => ({ ...prev, meetingType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intake">Project Intake Call</SelectItem>
                  <SelectItem value="consultation">Technical Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking_notes">Additional Notes</Label>
              <Input
                id="booking_notes"
                value={bookingDetails.notes}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any specific topics you'd like to discuss?"
              />
            </div>

            <Separator />

            {/* Booking Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleBookingSubmit}
                disabled={isBooking || !bookingDetails.name || !bookingDetails.email}
                className="flex-1"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDate('');
                  setSelectedTime('');
                }}
              >
                Change Time
              </Button>
            </div>

            {/* Booking Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• You'll receive a calendar invite with Zoom link</li>
                    <li>• Our team will review your project details beforehand</li>
                    <li>• We'll send a reminder 24 hours before the call</li>
                    <li>• The call typically lasts 30-45 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
