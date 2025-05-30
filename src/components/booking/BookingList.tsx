import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import useAuth from "../../hooks/use-auth.tsx";
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types/booking";
import { Calendar, Clock, Info, Loader2 } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BookingList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .order("event_date", { ascending: true });

        if (error) throw error;
        
        // Ensure all bookings have an updated_at field
        const processedData = (data || []).map(booking => ({
          ...booking,
          updated_at: (booking as any).updated_at || booking.created_at
        })) as Booking[];
        
        setBookings(processedData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user, toast]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    setCancelling(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", selectedBooking.id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: "cancelled" } 
          : booking
      ));

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      
      setCancelDialogOpen(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your bookings...</span>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Bookings Yet</CardTitle>
          <CardDescription>
            You don't have any bookings yet. Book an event to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Calendar className="h-16 w-16 text-muted-foreground opacity-50" />
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <a href="/services">Explore Our Services</a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
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
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                        <Info className="h-4 w-4 mr-1" /> Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                          Information about your booking
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Event Type</h4>
                            <p className="text-sm">
                              {booking.event_type.charAt(0).toUpperCase() + booking.event_type.slice(1)}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Status</h4>
                            <p className="text-sm">{getStatusBadge(booking.status)}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Date</h4>
                            <p className="text-sm">{format(new Date(booking.event_date), "MMMM d, yyyy")}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Time</h4>
                            <p className="text-sm">{booking.time || "Not specified"}</p>
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
                        <div>
                          <h4 className="text-sm font-medium">Created On</h4>
                          <p className="text-sm">
                            {format(new Date(booking.created_at), "MMMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {booking.status !== "cancelled" && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        setSelectedBooking(booking);
                        setCancelDialogOpen(true);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelBooking}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
