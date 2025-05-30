import { BookingModal } from "./BookingModal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceBookingButtonProps {
  eventType: string;
  buttonText?: string;
  buttonSize?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
  variant?: "default" | "outline";
  asLink?: boolean;
  linkTo?: string;
}

export const ServiceBookingButton = ({
  eventType,
  buttonText = "Book Now",
  buttonSize = "default",
  fullWidth = false,
  variant = "default",
  asLink = false,
  linkTo = "/contact"
}: ServiceBookingButtonProps) => {
  if (asLink) {
    return (
      <Button 
        size={buttonSize} 
        variant={variant} 
        className={fullWidth ? "w-full" : ""} 
        asChild
      >
        <Link to={linkTo}>{buttonText}</Link>
      </Button>
    );
  }

  return (
    <BookingModal
      eventType={eventType}
      buttonText={buttonText}
      buttonSize={buttonSize}
      fullWidth={fullWidth}
    />
  );
};
