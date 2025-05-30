import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    id: 1,
    title: "Summer Beach Party",
    date: "2024-07-15",
    time: "18:00",
    location: "Tzaneen Beach Club",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    description: "Join us for the ultimate summer beach party with live DJ and amazing sound system."
  },
  {
    id: 2,
    title: "Wedding Showcase",
    date: "2024-06-20",
    time: "14:00",
    location: "Royal Gardens",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552",
    description: "Experience our premium wedding sound and lighting services in action."
  },
  {
    id: 3,
    title: "Corporate Gala",
    date: "2024-08-10",
    time: "19:00",
    location: "Grand Hotel",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    description: "Elegant evening with professional sound and entertainment solutions."
  }
];

const FeaturedEvents = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us at these exciting events and experience our professional sound services firsthand
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <Link to={`/events/${event.id}`}>
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvents;