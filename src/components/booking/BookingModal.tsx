import { useState } from "react";
import { BookingForm } from "./BookingForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BookingModalProps {
  eventType?: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
  fullWidth?: boolean;
}

export function BookingModal({
  eventType,
  buttonText = "Book Now",
  buttonVariant = "default",
  buttonSize = "default",
  className = "",
  fullWidth = false,
}: BookingModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize} 
          className={`${fullWidth ? 'w-full' : ''} ${className}`}
        >
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Your Event</DialogTitle>
          <DialogDescription>
            Fill out the form below to request a booking for your event.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <BookingForm defaultEventType={eventType} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
