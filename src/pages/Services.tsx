
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Mic, Heart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Services = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBooking = (service: string) => {
    toast({
      title: "Booking Request Sent",
      description: `Thank you for your interest in our ${service} service. We'll contact you soon!`,
    });
  };

  const services = [
    {
      title: "Live Streaming",
      description: "Enjoy the sounds of Limpopo through our live streaming service",
      icon: Music,
      features: [
        "High-quality audio streaming",
        "Limpopo regional music",
        "Interactive song requests",
        "24/7 availability"
      ],
      path: "/services/party-sound",
      color: "from-blue-500 to-violet-500"
    },
    {
      title: "Song Requests",
      description: "Request your favorite songs to be played on our stream",
      icon: Mic,
      features: [
        "Easy request system",
        "Extensive music library",
        "Quick response time",
        "Special dedications"
      ],
      path: "/services/karaoke-sound",
      color: "from-pink-500 to-orange-400"
    },
    {
      title: "Special Events",
      description: "Join us for special streaming events and themed music sessions",
      icon: Heart,
      features: [
        "Themed music sessions",
        "Guest DJ appearances",
        "Interactive listener events",
        "Special holiday broadcasts"
      ],
      path: "/services/wedding-sound",
      color: "from-teal-400 to-emerald-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Professional sound solutions for every occasion. We bring exceptional audio
          experiences to your events with cutting-edge equipment and expert service.
        </p>
      </div>
      
      <motion.div 
        className="grid md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service, index) => (
          <motion.div key={service.title} variants={itemVariants}>
            <Card className="h-full bg-white dark:bg-slate-800 hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
              <CardHeader>
                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-primary">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button onClick={() => handleBooking(service.title)} className="flex-1">
                    Book Now
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 flex-1" asChild>
                    <Link to={service.path}>
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Need a Custom Solution?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          We can create tailor-made sound solutions for your specific needs. Contact us for a personalized quote.
        </p>
        <Button size="lg" onClick={() => navigate('/contact')}>
          Get in Touch
        </Button>
      </div>
    </div>
  );
};

export default Services;
