
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, PlusCircle, Volume2, Disc, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const PartySound = () => {
  const { toast } = useToast();

  const handleBooking = () => {
    toast({
      title: "Booking Request Sent",
      description: "Thank you for your interest in our Party Sound service. We'll contact you soon!",
    });
  };

  return (
    <div className="pt-16 bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6">
              <Music className="h-4 w-4" />
              <span className="text-sm font-medium">Party Sound Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional Sound for Your Perfect Party</h1>
            <p className="text-lg text-muted-foreground mb-8">
              SoundMaster provides premium quality sound equipment and DJ services to make your party unforgettable.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={handleBooking}>
                Book Now
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Get a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">What We Offer</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <Volume2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">High-Quality Sound Systems</h3>
                <p className="text-muted-foreground mb-4">
                  Professional-grade speakers, amplifiers, and mixers that deliver crystal clear sound with the perfect bass.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>JBL professional speakers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Digital mixing consoles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Wireless microphones</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <Disc className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Expert DJ Services</h3>
                <p className="text-muted-foreground mb-4">
                  Skilled DJs who know how to read the crowd and keep the dance floor packed all night long.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Experienced professional DJs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Extensive music collection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Custom playlists creation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Additional Services</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your party setup with our range of additional services to enhance the atmosphere.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Lighting effects and lasers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Fog machines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Dance floor installation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Pricing Packages</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Basic Package</h3>
                <p className="text-sm text-muted-foreground mb-6">Perfect for smaller gatherings</p>
                <div className="text-3xl font-bold mb-6">$499</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>4-hour DJ service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Basic sound system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Basic lighting</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleBooking}>Select Package</Button>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow border-primary">
              <CardContent className="p-6">
                <div className="bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full w-fit mb-4">Popular</div>
                <h3 className="text-xl font-semibold mb-2">Premium Package</h3>
                <p className="text-sm text-muted-foreground mb-6">Great for medium-sized events</p>
                <div className="text-3xl font-bold mb-6">$799</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>6-hour DJ service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Professional sound system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Advanced lighting setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Fog machine</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleBooking}>Select Package</Button>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Deluxe Package</h3>
                <p className="text-sm text-muted-foreground mb-6">Perfect for large events</p>
                <div className="text-3xl font-bold mb-6">$1,299</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>8-hour DJ service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Premium sound system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Complete lighting package</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Dance floor setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Assistant DJ</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleBooking}>Select Package</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Book Your Party Sound?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact us today to check availability for your event date and get a customized quote.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={handleBooking}>
                Book Now
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartySound;
