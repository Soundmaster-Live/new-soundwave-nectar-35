import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ContactCTA = () => {
  return (
    <div className="relative py-16">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay"
        }}
      />
      <div className="absolute inset-0 bg-primary/80"></div>
      <div className="container relative z-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to Create Your Perfect Sound?</h2>
        <p className="mb-8 text-lg">Contact us today to discuss your event needs</p>
        <Link to="/contact">
          <Button 
            variant="secondary" 
            size="lg"
            className="hover:scale-105 transition-transform"
          >
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ContactCTA;