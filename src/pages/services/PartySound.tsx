import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PartyPopper, Speaker, Users, Lightbulb, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingModal } from "@/components/booking/BookingModal";

const PartySound = () => {
  return (
    <div className="pt-16 bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6">
              <PartyPopper className="h-4 w-4" />
              <span className="text-sm font-medium">Party Sound Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Elevate Your Party With Premium Sound</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Founded in 2022, SoundMaster delivers exceptional sound experiences for parties and events across the Tzaneen community and Limpopo region.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <BookingModal
                eventType="party"
                buttonText="Book Now"
                buttonSize="lg"
              />
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
          <h2 className="text-3xl font-bold text-center mb-16">Our Party Services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <Speaker className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Premium Sound Systems</h3>
                <p className="text-muted-foreground mb-4">
                  High-quality sound equipment for crystal clear audio at any venue size.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Professional speakers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Subwoofers for deep bass</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Digital mixing console</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Professional DJs</h3>
                <p className="text-muted-foreground mb-4">
                  Experienced DJs who know how to read the crowd and keep the party going.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Diverse music selection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Taking requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>MC services available</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Lighting Effects</h3>
                <p className="text-muted-foreground mb-4">
                  Create the perfect atmosphere with our professional lighting setups.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>LED dance floor lighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Strobe and effect lights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Customizable color schemes</span>
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
          <h2 className="text-3xl font-bold text-center mb-16">Party Packages</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Small Gathering</h3>
                <p className="text-sm text-muted-foreground mb-6">For intimate parties</p>
                <div className="text-3xl font-bold mb-6">R3,499</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Up to 4 hours of service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Sound system for up to 50 people</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Basic lighting setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>DJ with standard playlist</span>
                  </li>
                </ul>
                <BookingModal
                  eventType="party"
                  buttonText="Select Package"
                  fullWidth
                />
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow border-primary">
              <CardContent className="p-6">
                <div className="bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full w-fit mb-4">Popular</div>
                <h3 className="text-xl font-semibold mb-2">Medium Event</h3>
                <p className="text-sm text-muted-foreground mb-6">For standard parties</p>
                <div className="text-3xl font-bold mb-6">R6,999</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Up to 6 hours of service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Sound system for up to 150 people</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Enhanced lighting package</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Professional DJ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Custom playlist creation</span>
                  </li>
                </ul>
                <BookingModal
                  eventType="party"
                  buttonText="Select Package"
                  fullWidth
                />
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Large Event</h3>
                <p className="text-sm text-muted-foreground mb-6">For big celebrations</p>
                <div className="text-3xl font-bold mb-6">R12,999</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Up to 8 hours of service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Sound system for 300+ people</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Premium lighting package</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Professional DJ + MC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Custom playlist & music planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Backup equipment included</span>
                  </li>
                </ul>
                <BookingModal
                  eventType="party"
                  buttonText="Select Package"
                  fullWidth
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get the Party Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact us today to discuss your party needs and let us help create an unforgettable experience for you and your guests.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <BookingModal
                eventType="party"
                buttonText="Book Now"
                buttonSize="lg"
              />
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
