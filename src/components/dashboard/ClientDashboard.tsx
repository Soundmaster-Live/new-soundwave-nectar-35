
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Play, Radio, Music, MessageSquare } from "lucide-react";

interface ClientDashboardProps {
  user: User;
}

// Sample data for demonstration
const sampleEvents = [
  { name: "Party Event", value: 3 },
  { name: "Wedding", value: 1 },
  { name: "Karaoke", value: 2 },
];

const COLORS = ['#FF4F1F', '#FF8C61', '#FFB69E', '#FFC7B1'];

const ClientDashboard = ({ user }: ClientDashboardProps) => {
  const navigate = useNavigate();
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      setBookingCount(count || 0);
    };
    
    fetchBookings();
  }, [user]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookingCount}</div>
          <p className="text-xs text-muted-foreground">Total bookings made</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/contact")}>
            Book a New Event
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Live Radio</CardTitle>
          <Radio className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <div className="text-sm font-medium">Live Now</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">SoundMaster Radio</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/live-radio")}>
            <Play className="mr-2 h-4 w-4" /> Listen Now
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Live Lessons</CardTitle>
          <Music className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">Next lesson in 3 days</div>
          <p className="text-xs text-muted-foreground mt-1">DJ Basics 101</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/live-lesson")}>
            Join Lesson
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Service Usage</CardTitle>
          <CardDescription>Your booked services breakdown</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[200px]">
            {bookingCount > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sampleEvents}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sampleEvents.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">No booking data available</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate("/contact")}
                  >
                    Make Your First Booking
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Unread messages</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/contact")}>
            Contact Support
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientDashboard;
