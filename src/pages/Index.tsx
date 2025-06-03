
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
      title: "Nyashinski Live in Concert",
      artist: "Nyashinski",
      date: "2024-07-15",
      time: "20:00",
      venue: "KICC Grounds",
      location: "Nairobi, Kenya",
      price: 2500,
      image: "/placeholder.svg",
      category: "concert",
      rating: 4.9,
      attendees: 8000
    },
    {
      id: 2,
      title: "Koroga Festival 2024",
      artist: "Various Artists",
      date: "2024-06-22",
      time: "14:00",
      venue: "Carnivore Grounds",
      location: "Nairobi, Kenya",
      price: 3500,
      image: "/placeholder.svg",
      category: "festival",
      rating: 4.8,
      attendees: 15000
    },
    {
      id: 3,
      title: "Sauti Sol Farewell Tour",
      artist: "Sauti Sol",
      date: "2024-08-10",
      time: "19:00",
      venue: "Uhuru Gardens",
      location: "Nairobi, Kenya",
      price: 4000,
      image: "/placeholder.svg",
      category: "concert",
      rating: 4.9,
      attendees: 12000
    },
    {
      id: 4,
      title: "Blankets & Wine",
      artist: "Various Artists",
      date: "2024-06-30",
      time: "15:00",
      venue: "Ngong Racecourse",
      location: "Nairobi, Kenya",
      price: 2000,
      image: "/placeholder.svg",
      category: "festival",
      rating: 4.7,
      attendees: 5000
    },
    {
      id: 5,
      title: "Diamond Platnumz Live",
      artist: "Diamond Platnumz",
      date: "2024-07-05",
      time: "20:30",
      venue: "Kasarani Stadium",
      location: "Nairobi, Kenya",
      price: 3000,
      image: "/placeholder.svg",
      category: "concert",
      rating: 4.8,
      attendees: 25000
    },
    {
      id: 6,
      title: "Amapiano Night",
      artist: "DJ Maphorisa & Kabza De Small",
      date: "2024-06-25",
      time: "21:00",
      venue: "Alchemist Bar",
      location: "Nairobi, Kenya",
      price: 1500,
      image: "/placeholder.svg",
      category: "concert",
      rating: 4.6,
      attendees: 800
    }
  ];

  const stats = [
    { icon: Music, label: "Events", value: "500+" },
    { icon: Users, label: "Happy Customers", value: "50K+" },
    { icon: Star, label: "Average Rating", value: "4.8" },
    { icon: MapPin, label: "Cities", value: "10+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">EventBooker Kenya</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Events</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Venues</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">My Bookings</a>
              <Button variant="outline">Sign In</Button>
              <Button className="bg-green-600 hover:bg-green-700">Sign Up</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Amazing
            <span className="text-green-600 block">Events & Concerts in Kenya</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book tickets for the best concerts, festivals, and events across Kenya. 
            From intimate venues to massive festivals in Nairobi, Mombasa, Kisumu and more.
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
              <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-green-600 mx-auto mb-2" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events in Kenya</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these incredible upcoming events across Kenya
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
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
                <span className="text-xl font-bold">EventBooker Kenya</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for amazing event experiences across Kenya.
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
                <li><a href="#" className="hover:text-white transition-colors">M-Pesa Payments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Cities</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Nairobi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mombasa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kisumu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nakuru</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EventBooker Kenya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
