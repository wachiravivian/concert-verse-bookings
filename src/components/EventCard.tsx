
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Star } from "lucide-react";

interface Event {
  id: number;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  attendees: number;
}

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatAttendees = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-green-600">
          {event.category}
        </Badge>
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-md text-sm flex items-center">
          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
          {event.rating}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="text-green-600 font-medium">
          {event.artist}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDate(event.date)} at {event.time}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {event.venue}, {event.location}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          {formatAttendees(event.attendees)} attending
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">{formatPrice(event.price)}</span>
            <span className="text-gray-600 ml-1">per ticket</span>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
