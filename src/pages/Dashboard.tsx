
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CalendarRange, Clock, ListMusic, MusicIcon, Radio, Users, Calendar, MessageSquare } from "lucide-react";
import { User } from "@/types/user";
import { createPlaceholderUser } from "@/utils/auth-helpers";

import ClientDashboard from "@/components/dashboard/ClientDashboard";
import BroadcasterDashboard from "@/components/dashboard/BroadcasterDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { BookingList } from "@/components/booking/BookingList";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    // If user is not logged in, redirect to auth page
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  // Redirect to admin panel for admins
  useEffect(() => {
    // We'll check admin status from the auth context
    const { isAdmin } = useAuth();
    if (isAdmin) {
      navigate("/admin");
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If no user, don't render dashboard (redirect handles this)
  if (!user) return null;

  return (
    <div className="container py-8 min-h-screen">
      <DashboardHeader user={user ? createPlaceholderUser(user) : {} as User} />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <ClientDashboard user={user ? createPlaceholderUser(user) : {} as User} />
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View and manage your event bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events you might be interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CalendarRange className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Upcoming Events</h3>
                <p className="text-muted-foreground mt-2">There are no upcoming events at the moment. Check back later!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with our team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Messages</h3>
                <p className="text-muted-foreground mt-2">You don't have any messages yet. Contact our team if you need assistance.</p>
                <Button className="mt-4" onClick={() => navigate("/contact")}>Contact Us</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
