// src/components/eventcard.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookingForm } from "@/components/BookingForm"; // Import the new component
import { useState } from "react";



interface Event {
  eventId: number;
  name: string;
  description: string;
  eventDate: string;
  venue: string;
  ticketPrice: number; // Even if it's typed as number, runtime can be string from API
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const handleBookingSuccess = () => {
    setIsBookingDialogOpen(false); // Close the dialog on successful booking
    alert('Booking successful! Please check your phone for M-Pesa prompt.');
  };

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // --- THIS IS THE LINE TO FIX (around line 51) ---
  const displayPrice = parseFloat(event.ticketPrice as any).toFixed(2);
  // Or, less explicitly typed:
  // const displayPrice = (+event.ticketPrice).toFixed(2);
  // Or simply:
  // const displayPrice = Number(event.ticketPrice).toFixed(2);


  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.venue}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 mb-2">{event.description}</p>
        <p className="text-md font-medium text-gray-800">Date: {formattedDate}</p>
        {/* Update this line to use displayPrice */}
        <p className="text-lg font-bold text-blue-600">Ksh {displayPrice}</p>
      </CardContent>
      <CardFooter>
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Book Now
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book Tickets for {event.name}</DialogTitle>
              <DialogDescription>
                Enter your details to confirm your booking.
              </DialogDescription>
            </DialogHeader>
            <BookingForm
              eventId={event.eventId}
              eventName={event.name}
              eventTicketPrice={parseFloat(event.ticketPrice as any)} // <--- ALSO FIX THIS IN BOOKINGFORM PROP
              onBookingSuccess={handleBookingSuccess}
              onClose={() => setIsBookingDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default EventCard;