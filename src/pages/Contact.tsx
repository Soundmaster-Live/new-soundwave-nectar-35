
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin } from "lucide-react";
import ContactMap from "@/components/ContactMap";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
    });
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">081 543 6748</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">soundmasterlive@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted-foreground">Tzaneen, Limpopo, South Africa</p>
                  </div>
                </div>
                <h3 className="font-semibold mt-6">Social Media & Streaming</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a href="https://www.facebook.com/profile.php?id=100091905356956" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook</a>
                  <a href="http://160.226.161.31:8000/Soundmasterlive" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Live Stream</a>
                  <a href="https://www.younow.com/Soundmaster" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouNow</a>
                  <a href="https://kick.com/soundmasterlive" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Kick</a>
                  <a href="https://www.virtualdj.com/ask/Soundmaster" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Request Songs</a>
                </div>
              </div>
            </CardContent>
          </Card>

          <ContactMap />
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2">Name</label>
                <Input id="name" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">Email</label>
                <Input id="email" type="email" placeholder="Your email" required />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2">Phone</label>
                <Input id="phone" type="tel" placeholder="Your phone number" required />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2">Message</label>
                <Textarea
                  id="message"
                  placeholder="Your message"
                  className="min-h-[150px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
