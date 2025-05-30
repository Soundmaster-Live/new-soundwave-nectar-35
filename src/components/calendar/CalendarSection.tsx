import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import type { Booking } from "@/types/booking";
import { useNavigate } from "react-router-dom";

const timeSlots = ["10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];

const CalendarSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', date],
    queryFn: async () => {
      if (!date || !session) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('event_date', format(date, 'yyyy-MM-dd'));
      
      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Error loading bookings",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return (data || []) as Booking[];
    },
    enabled: !!session, // Only run query if user is authenticated
  });

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      toast({
        title: "Date Selected",
        description: `Selected date: ${format(newDate, 'MMMM do, yyyy')}`,
      });
    }
  };

  const handleTimeSlotClick = () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a time slot",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
  };

  const isTimeSlotBooked = (time: string) => {
    return bookings?.some(booking => booking.time === time) || false;
  };

  return (
    <div className="py-20 bg-white">
      <div className="container">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Book Your Event</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-semibold">Available Time Slots</h3>
              {isLoading ? (
                <p>Loading available slots...</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="w-full"
                      disabled={isTimeSlotBooked(time)}
                      onClick={handleTimeSlotClick}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarSection;