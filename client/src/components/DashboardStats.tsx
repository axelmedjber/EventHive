import { useQuery } from "@tanstack/react-query";
import { Event, Registration } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend 
} from "recharts";
import { Ticket, Users, Calendar, DollarSign } from "lucide-react";

interface DashboardStatsProps {
  organizerId: number;
}

export default function DashboardStats({ organizerId }: DashboardStatsProps) {
  const { data: events } = useQuery<Event[]>({
    queryKey: [`/api/events/organizer/${organizerId}`],
  });
  
  const { data: upcomingEvents } = useQuery<Event[]>({
    queryKey: [`/api/events/organizer/${organizerId}`],
    select: (data) => data.filter(
      event => new Date(event.startDate) > new Date()
    ),
  });
  
  // For each event, get registrations
  const eventIds = events?.map(event => event.id) || [];
  
  const registrationsQueries = useQuery<Registration[][]>({
    queryKey: ['/api/dashboard/registrations', organizerId],
    enabled: eventIds.length > 0,
    select: (data) => {
      if (!data) return [];
      
      // Group registrations by event
      const byEvent: { [key: number]: Registration[] } = {};
      
      data.forEach(reg => {
        if (!byEvent[reg.eventId]) {
          byEvent[reg.eventId] = [];
        }
        byEvent[reg.eventId].push(reg);
      });
      
      return Object.values(byEvent);
    }
  });
  
  // Calculating total revenue and attendees
  const totalRevenue = registrationsQueries.data?.flat()
    .reduce((sum, reg) => sum + reg.totalPrice, 0) || 0;
  
  const totalAttendees = registrationsQueries.data?.flat()
    .reduce((sum, reg) => sum + reg.quantity, 0) || 0;
  
  // Data for the revenue by event chart
  const revenueByEvent = events?.map(event => {
    const registrations = registrationsQueries.data?.flat()
      .filter(reg => reg.eventId === event.id) || [];
    
    const revenue = registrations.reduce((sum, reg) => sum + reg.totalPrice, 0);
    
    return {
      name: event.title.length > 20 ? event.title.substring(0, 20) + "..." : event.title,
      revenue: revenue / 100 // Convert cents to dollars for display
    };
  }) || [];
  
  // Data for the attendees by event pie chart
  const attendeesByEvent = events?.map(event => {
    const registrations = registrationsQueries.data?.flat()
      .filter(reg => reg.eventId === event.id) || [];
    
    const attendees = registrations.reduce((sum, reg) => sum + reg.quantity, 0);
    
    return {
      name: event.title.length > 15 ? event.title.substring(0, 15) + "..." : event.title,
      attendees
    };
  }) || [];
  
  // Custom colors for the pie chart
  const COLORS = ['#D1410C', '#3659E3', '#1E0A3C', '#6B7280', '#059669'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue / 100)}</div>
            <p className="text-xs text-muted-foreground">
              From all your events
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttendees}</div>
            <p className="text-xs text-muted-foreground">
              Across all events
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Events you've created
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Events in the future
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Event</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByEvent}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#D1410C" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendees by Event</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendeesByEvent}
                  nameKey="name"
                  dataKey="attendees"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={(entry) => `${entry.name}: ${entry.attendees}`}
                >
                  {attendeesByEvent.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} attendees`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
