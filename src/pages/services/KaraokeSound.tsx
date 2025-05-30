
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Music2, List, Tv2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const KaraokeSound = () => {
  const { toast } = useToast();

  const handleBooking = () => {
    toast({
      title: "Booking Request Sent",
      description: "Thank you for your interest in our Karaoke Sound service. We'll contact you soon!",
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
              <Mic className="h-4 w-4" />
              <span className="text-sm font-medium">Karaoke Sound Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Complete Karaoke Setup For Entertaining Events</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Turn your event into an unforgettable singing experience with SoundMaster's professional karaoke equipment and services.
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
                  <Music2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Extensive Song Library</h3>
                <p className="text-muted-foreground mb-4">
                  Our karaoke system comes with thousands of songs across all genres and decades.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Over 50,000 songs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Regular updates with new releases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Multiple languages available</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Professional Equipment</h3>
                <p className="text-muted-foreground mb-4">
                  Top-quality equipment that ensures crystal-clear sound and smooth performance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>High-quality microphones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Professional sound system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Digital mixers with effects</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <Tv2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Visual Display</h3>
                <p className="text-muted-foreground mb-4">
                  Crystal clear lyric displays and engaging visuals for the complete karaoke experience.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>HD displays</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Dual-screen setup available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Customized backgrounds</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Karaoke Packages</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Basic Karaoke</h3>
                <p className="text-sm text-muted-foreground mb-6">For small private parties</p>
                <div className="text-3xl font-bold mb-6">$399</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>4-hour service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>2 wireless microphones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Basic sound setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Song request system</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleBooking}>Select Package</Button>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow border-primary">
              <CardContent className="p-6">
                <div className="bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full w-fit mb-4">Popular</div>
                <h3 className="text-xl font-semibold mb-2">Premium Karaoke</h3>
                <p className="text-sm text-muted-foreground mb-6">Perfect for larger gatherings</p>
                <div className="text-3xl font-bold mb-6">$699</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>6-hour service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>4 wireless microphones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Professional sound system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Dual display setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>KJ host included</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleBooking}>Select Package</Button>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Corporate Karaoke</h3>
                <p className="text-sm text-muted-foreground mb-6">For company events</p>
                <div className="text-3xl font-bold mb-6">$999</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>8-hour service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>6 wireless microphones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Premium sound system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Multiple display setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Professional KJ and MC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Custom branding options</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleBooking}>Select Package</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Song Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Song Categories</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Pop & Rock</h3>
                  <p className="text-sm text-muted-foreground">15,000+ songs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">R&B & Soul</h3>
                  <p className="text-sm text-muted-foreground">8,000+ songs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Country</h3>
                  <p className="text-sm text-muted-foreground">5,000+ songs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Hip-Hop & Rap</h3>
                  <p className="text-sm text-muted-foreground">7,000+ songs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Oldies</h3>
                  <p className="text-sm text-muted-foreground">6,000+ songs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">International</h3>
                  <p className="text-sm text-muted-foreground">10,000+ songs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Disney & Kids</h3>
                  <p className="text-sm text-muted-foreground">3,000+ songs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Latest Hits</h3>
                  <p className="text-sm text-muted-foreground">Updated weekly</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Book Your Karaoke Event?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact us today to check availability for your event date and get a personalized quote.
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

export default KaraokeSound;
