import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ConsultationButton = () => {
  return (
    <div className="pt-8">
      <Link to="/contact">
        <Button className="group">
          Book a Consultation
          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};

export default ConsultationButton;