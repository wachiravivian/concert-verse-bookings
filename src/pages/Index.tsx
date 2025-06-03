
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, Users, Music, Star } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { SearchFilters } from "@/components/SearchFilters";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const featuredEvents = [
    {
      id: 1,
      title: "Summer Music Festival 2024",
      artist: "Various Artists",
      date: "2024-07-15",
      time: "18:00",
      venue: "Central Park",
      location: "New York, NY",
      price: 89,
      image: "/placeholder.svg",
      category: "festival",
      rating: 4.8,
      attendees: 15000
    },
    {
      id: 2,
      title: "Rock Legends Live",
      artist: "The Electric Band",
      date: "2024-06-22",
      time: "20:00",
      venue: "Madison Square Garden",
      location: "New York, NY",
      price: 125,
      image: "/placeholder.svg",
      category: "concert",
      rating: 4.9,
      attendees: 8500
    },
    {
      id: 3,
      title: "Jazz & Blues Night",
      artist: "Blue Note Collective",
      date: "2024-06-10",
      time: "19:30",
      venue: "Blue Note Club",
      location: "New York, NY",
      price: 65,
      image: "/placeholder.svg",
      category: "concert",
      rating: 4.7,
      attendees: 350
    }
  ];

  const stats = [
    { icon: Music, label: "Events", value: "500+" },
    { icon: Users, label: "Happy Customers", value: "50K+" },
    { icon: Star, label: "Average Rating", value: "4.8" },
    { icon: MapPin, label: "Cities", value: "25+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">EventBooker</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Events</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Venues</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">My Bookings</a>
              <Button variant="outline">Sign In</Button>
              <Button>Sign Up</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Amazing
            <span className="text-purple-600 block">Events & Concerts</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book tickets for the best concerts, festivals, and events in your city. 
            From intimate venues to massive festivals.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Search events, artists, venues..." 
                  className="pl-10 py-3 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="px-8">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <SearchFilters 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these incredible upcoming events
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              View All Events
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Music className="h-6 w-6" />
                <span className="text-xl font-bold">EventBooker</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for amazing event experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Events</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Concerts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Festivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sports</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Theatre</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refunds</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EventBooker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
