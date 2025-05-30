import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types/booking";
import { Calendar, Clock, Info, Loader2, CheckCircle, XCircle, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { UserProfile } from "@/types/profile";

export function BookingManagement() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<(Booking & { user_profile?: UserProfile })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [adminNote, setAdminNote] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // First get all bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (bookingsError) throw bookingsError;
        
        // Then fetch user profiles separately
        const bookingsWithProfiles = await Promise.all(
          (bookingsData || []).map(async (booking) => {
            if (!booking.user_id) return { ...booking, user_profile: undefined };
            
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("id, username, is_admin, created_at")
              .eq("id", booking.user_id)
              .single();
              
            return {
              ...booking,
              user_profile: profileError ? undefined : profileData
            };
          })
        );

        setBookings(bookingsWithProfiles);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedBooking.id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: newStatus } 
          : booking
      ));

      // Send notification to user (in a real app, this would trigger an email or push notification)
      // This is a placeholder for demonstration purposes
      console.log(`Notification would be sent to user about booking ${selectedBooking.id} status update to ${newStatus}`);

      toast({
        title: "Status Updated",
        description: `Booking status has been updated to ${newStatus}.`,
      });
      
      setStatusUpdateDialogOpen(false);
      setNewStatus("");
      setAdminNote("");
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.filter(b => b.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.filter(b => b.status === "confirmed").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.filter(b => b.status === "cancelled").length}</div>
          </CardContent>
        </Card>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-muted-foreground mt-2">
            {filter === "all" 
              ? "There are no bookings in the system yet." 
              : `There are no bookings with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {booking.user_profile?.username || "Unknown User"}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {booking.event_type.charAt(0).toUpperCase() + booking.event_type.slice(1)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {format(new Date(booking.event_date), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {booking.time || "Not specified"}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>{format(new Date(booking.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                            <Info className="h-4 w-4 mr-1" /> Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                              Complete information about this booking
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium">Client</h4>
                                <p className="text-sm">{booking.user_profile?.username || "Unknown User"}</p>
                                <p className="text-xs text-muted-foreground">User ID: {booking.user_id}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Status</h4>
                                <p className="text-sm">{getStatusBadge(booking.status)}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Event Type</h4>
                                <p className="text-sm">
                                  {booking.event_type.charAt(0).toUpperCase() + booking.event_type.slice(1)}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Date & Time</h4>
                                <p className="text-sm">
                                  {format(new Date(booking.event_date), "MMMM d, yyyy")}
                                  {booking.time ? ` at ${booking.time}` : ""}
                                </p>
                              </div>
                            </div>
                            {booking.details && (
                              <div>
                                <h4 className="text-sm font-medium">Additional Details</h4>
                                <p className="text-sm whitespace-pre-wrap">{booking.details}</p>
                              </div>
                            )}
                            <div>
                              <h4 className="text-sm font-medium">Booking ID</h4>
                              <p className="text-sm font-mono">{booking.id}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium">Created On</h4>
                                <p className="text-sm">
                                  {format(new Date(booking.created_at), "MMM d, yyyy")}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Last Updated</h4>
                                <p className="text-sm">
                                  {format(new Date(booking.updated_at || booking.created_at), "MMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={() => {
                                setSelectedBooking(booking);
                                setNewStatus(booking.status);
                                setStatusUpdateDialogOpen(true);
                              }}
                            >
                              Update Status
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setNewStatus(booking.status);
                          setStatusUpdateDialogOpen(true);
                        }}
                      >
                        Update Status
                      </Button>
                      
                      {booking.status === "pending" && (
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setNewStatus("confirmed");
                            setAdminNote("Your booking has been confirmed. We look forward to seeing you!");
                            setStatusUpdateDialogOpen(true);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                        </Button>
                      )}
                      
                      {(booking.status === "pending" || booking.status === "confirmed") && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setNewStatus("cancelled");
                            setAdminNote("Unfortunately, we had to cancel your booking. Please contact us for more information.");
                            setStatusUpdateDialogOpen(true);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={statusUpdateDialogOpen} onOpenChange={setStatusUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status of this booking and add a note for the client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Note to Client (Optional)</label>
              <Textarea 
                placeholder="Add a note that will be sent to the client"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This note will be included in the notification sent to the client.
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setStatusUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              disabled={updatingStatus || !newStatus}
            >
              {updatingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
