import { Users, Music, Calendar, Star } from "lucide-react";

const stats = [
  {
    label: "Happy Clients",
    value: "500+",
    icon: <Users className="h-6 w-6" />,
    description: "Satisfied customers across Tzaneen"
  },
  {
    label: "Events Hosted",
    value: "1000+",
    icon: <Calendar className="h-6 w-6" />,
    description: "Successful events and counting"
  },
  {
    label: "Songs Available",
    value: "5000+",
    icon: <Music className="h-6 w-6" />,
    description: "Extensive music collection"
  },
  {
    label: "5-Star Reviews",
    value: "250+",
    icon: <Star className="h-6 w-6" />,
    description: "Consistently rated excellent"
  }
];

const StatsSection = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</p>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;