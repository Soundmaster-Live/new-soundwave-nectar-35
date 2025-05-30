import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Music, Mic, RadioTower, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingModal } from "@/components/booking/BookingModal";

const WeddingSound = () => {
  return (
    <div className="pt-16 bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Wedding Sound Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Perfect Sound for Your Perfect Day</h1>
            <p className="text-lg text-muted-foreground mb-8">
              SoundMaster provides professional audio services for every moment of your wedding celebration in Tzaneen and across the Limpopo region.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <BookingModal
                eventType="wedding"
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
          <h2 className="text-3xl font-bold text-center mb-16">Our Wedding Services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Ceremony Sound</h3>
                <p className="text-muted-foreground mb-4">
                  Crystal clear sound for your vows and ceremony music, ensuring every word is heard.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Wireless lapel microphones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Discreet speaker placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Ceremony music coordination</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Reception Entertainment</h3>
                <p className="text-muted-foreground mb-4">
                  Professional DJ services and sound equipment for a memorable reception.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Experienced wedding DJ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Custom playlist creation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>MC services for announcements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                  <RadioTower className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Full Wedding Package</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive sound and entertainment for your entire wedding day.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Ceremony, cocktail hour, and reception</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Lighting packages available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Backup equipment included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Wedding Packages Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Wedding Packages</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Ceremony Only</h3>
                <p className="text-sm text-muted-foreground mb-6">For intimate weddings</p>
                <div className="text-3xl font-bold mb-6">R5,999</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Up to 2 hours of service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Wireless microphones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Ceremony music playback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Early setup and sound check</span>
                  </li>
                </ul>
                <BookingModal
                  eventType="wedding"
                  buttonText="Select Package"
                  fullWidth
                />
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow border-primary">
              <CardContent className="p-6">
                <div className="bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full w-fit mb-4">Popular</div>
                <h3 className="text-xl font-semibold mb-2">Reception Package</h3>
                <p className="text-sm text-muted-foreground mb-6">For your celebration</p>
                <div className="text-3xl font-bold mb-6">R12,999</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>5 hours of DJ service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Professional sound system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Dance floor lighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>MC services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Custom playlist</span>
                  </li>
                </ul>
                <BookingModal
                  eventType="wedding"
                  buttonText="Select Package"
                  fullWidth
                />
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Complete Wedding</h3>
                <p className="text-sm text-muted-foreground mb-6">Ceremony & Reception</p>
                <div className="text-3xl font-bold mb-6">R18,999</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Ceremony sound service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Cocktail hour music</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>6 hours of reception DJ service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Premium lighting package</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Online planning portal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Backup equipment</span>
                  </li>
                </ul>
                <BookingModal
                  eventType="wedding"
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
            <h2 className="text-3xl font-bold mb-6">Plan Your Perfect Wedding Sound</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact us today to discuss your wedding plans and let us help create the perfect soundtrack for your special day.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <BookingModal
                eventType="wedding"
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

export default WeddingSound;
