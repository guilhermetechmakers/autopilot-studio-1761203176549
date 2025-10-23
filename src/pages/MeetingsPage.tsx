import { useState } from "react";
import { Plus, Search, Filter, Calendar, Clock, Users, Video, MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const meetings = [
  {
    id: 1,
    title: "Project Kickoff Meeting",
    project: "E-commerce Platform",
    type: "Video Call",
    date: "2024-02-15",
    time: "10:00 AM",
    duration: "60 min",
    attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
    status: "Scheduled",
    location: "Zoom Meeting"
  },
  {
    id: 2,
    title: "Client Review Session",
    project: "Mobile App Redesign",
    type: "In-Person",
    date: "2024-02-18",
    time: "2:00 PM",
    duration: "90 min",
    attendees: ["Sarah Wilson", "Client Team"],
    status: "Scheduled",
    location: "Office Conference Room A"
  },
  {
    id: 3,
    title: "Sprint Planning",
    project: "AI Integration",
    type: "Video Call",
    date: "2024-02-12",
    time: "9:00 AM",
    duration: "120 min",
    attendees: ["Development Team"],
    status: "Completed",
    location: "Microsoft Teams"
  },
  {
    id: 4,
    title: "Design Review",
    project: "Website Redesign",
    type: "Video Call",
    date: "2024-02-20",
    time: "3:00 PM",
    duration: "45 min",
    attendees: ["Design Team", "Client"],
    status: "Scheduled",
    location: "Google Meet"
  }
];

const statusColors = {
  "Scheduled": "bg-blue-100 text-blue-800",
  "Completed": "bg-green-100 text-green-800",
  "Cancelled": "bg-red-100 text-red-800",
  "In Progress": "bg-yellow-100 text-yellow-800"
};

const typeIcons = {
  "Video Call": Video,
  "In-Person": MapPin,
  "Phone Call": Clock
};

export default function MeetingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.attendees.some(attendee => attendee.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || meeting.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || meeting.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const getUpcomingMeetings = () => {
    const today = new Date();
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate >= today && meeting.status === "Scheduled";
    }).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-semibold text-text-primary">Autopilot Studio</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Profile</Button>
              <Button variant="outline">Settings</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Meetings</h1>
            <p className="text-text-secondary mt-2">
              Schedule and manage your team meetings and client calls
            </p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {/* Upcoming Meetings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Upcoming Meetings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getUpcomingMeetings().map((meeting) => {
              const TypeIcon = typeIcons[meeting.type as keyof typeof typeIcons];
              return (
                <Card key={meeting.id} className="card-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TypeIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">{meeting.title}</h3>
                        <p className="text-sm text-text-secondary">{meeting.project}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-text-secondary">
                          <Calendar className="h-4 w-4" />
                          <span>{meeting.date} at {meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
                          <Clock className="h-4 w-4" />
                          <span>{meeting.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="in progress">In Progress</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Types</option>
            <option value="video call">Video Call</option>
            <option value="in-person">In-Person</option>
            <option value="phone call">Phone Call</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => {
            const TypeIcon = typeIcons[meeting.type as keyof typeof typeIcons];
            return (
              <Card key={meeting.id} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">{meeting.title}</h3>
                          <p className="text-sm text-text-secondary">{meeting.project}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[meeting.status as keyof typeof statusColors]}`}>
                            {meeting.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{meeting.date} at {meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{meeting.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{meeting.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-text-secondary" />
                          <span className="text-sm text-text-secondary">Attendees:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {meeting.attendees.map((attendee, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {attendee}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMeetings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-text-secondary mb-4">
              No meetings found matching your criteria.
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Schedule your first meeting
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-text-primary">{meetings.length}</div>
              <p className="text-sm text-text-secondary">Total Meetings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {meetings.filter(m => m.status === "Scheduled").length}
              </div>
              <p className="text-sm text-text-secondary">Scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {meetings.filter(m => m.status === "Completed").length}
              </div>
              <p className="text-sm text-text-secondary">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-text-primary">
                {meetings.filter(m => m.type === "Video Call").length}
              </div>
              <p className="text-sm text-text-secondary">Video Calls</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}