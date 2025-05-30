import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About Soundmaster</h1>
        
        <div className="relative mb-12">
          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745"
            alt="Soundmaster equipment"
            className="w-full h-[300px] object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <p className="text-white text-2xl font-semibold">Bringing Quality Sound Since 2022</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2022, Soundmaster began as a passion project aimed at bringing quality sound to the Tzaneen community. 
              What started as a non-profit private hobby has grown into a trusted name in professional sound services across the Limpopo region.
            </p>
            <p className="text-muted-foreground">
              Our mission is to deliver exceptional sound experiences while showcasing the natural beauty and attractions of our region. 
              We take pride in being part of countless memorable events, from intimate gatherings to grand celebrations.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Our Values</h3>
              <ul className="space-y-2">
                <li>✓ Quality Service</li>
                <li>✓ Professional Equipment</li>
                <li>✓ Customer Satisfaction</li>
                <li>✓ Community Focus</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Service Area</h3>
              <ul className="space-y-2">
                <li>✓ Tzaneen</li>
                <li>✓ Greater Limpopo Region</li>
                <li>✓ Surrounding Communities</li>
                <li>✓ Special Events Nationwide</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;