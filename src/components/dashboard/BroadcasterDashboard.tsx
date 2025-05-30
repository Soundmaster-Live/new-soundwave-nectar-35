
import { User } from "@/types/user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Users, Radio, Music, ActivitySquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

// Sample data for demonstration
const listenerData = [
  { name: "Mon", listeners: 40 },
  { name: "Tue", listeners: 30 },
  { name: "Wed", listeners: 20 },
  { name: "Thu", listeners: 27 },
  { name: "Fri", listeners: 18 },
  { name: "Sat", listeners: 23 },
  { name: "Sun", listeners: 34 },
];

interface BroadcasterDashboardProps {
  user: User;
}

const BroadcasterDashboard = ({ user }: BroadcasterDashboardProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Listeners</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">28</div>
          <p className="text-xs text-muted-foreground">+19% from last week</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/live-radio")}>
            Go to Broadcast
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Broadcast Status</CardTitle>
          <Radio className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <div className="text-sm font-medium">Live Now</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">02:34:15 elapsed</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/live-radio")}>
            Manage Stream
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stream Health</CardTitle>
          <ActivitySquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium text-green-500">Excellent</div>
          <p className="text-xs text-muted-foreground mt-1">Bitrate: 320kbps</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/live-radio")}>
            View Details
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Listener Trends</CardTitle>
          <CardDescription>Daily listener count for the past week</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={listenerData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="listeners" stroke="#FF4F1F" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Shows</CardTitle>
          <Mic className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">Friday Night Mix</div>
          <p className="text-xs text-muted-foreground mt-1">Starts in 2 days, 5 hours</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/admin")}>
            Manage Shows
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BroadcasterDashboard;
