import { Button } from "@/components/ui/button";
import { Music, Headphones, PartyPopper, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Party Sound Services",
    description: "Premium sound equipment and expert DJs for any celebration.",
    icon: <PartyPopper className="h-12 w-12" />,
    link: "/services#party",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
  },
  {
    title: "Karaoke Sound Services",
    description: "Professional karaoke setup with extensive song collection.",
    icon: <Headphones className="h-12 w-12" />,
    link: "/services#karaoke",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81"
  },
  {
    title: "Wedding Sound Services",
    description: "Creating perfect musical moments for your special day.",
    icon: <Heart className="h-12 w-12" />,
    link: "/services#wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552"
  },
  {
    title: "Corporate Events",
    description: "Professional audio solutions for business gatherings.",
    icon: <Music className="h-12 w-12" />,
    link: "/services#corporate",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
  }
];

const ServicesSection = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-white transform -translate-y-4 group-hover:translate-y-0 transition-transform">
                    {service.icon}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link to={service.link}>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;