// src/pages/MyBookings.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast"; // For displaying notifications

interface Booking {
  id: number;
  event_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  num_tickets: number;
  total_price: number;
  booking_date: string; // ISO 8601 string
  payment_status: 'pending' | 'completed' | 'failed';
}

interface EventSummary { // To display event title along with booking
  id: number;
  title: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<EventSummary[]>([]); // To map event_id to event title
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookingsAndEvents = async () => {
      try {
        // Fetch bookings
        const bookingsResponse = await fetch('http://localhost:5000/api/bookings');
        if (!bookingsResponse.ok) {
          throw new Error(`HTTP error! status: ${bookingsResponse.status} for bookings`);
        }
        const bookingsData: Booking[] = await bookingsResponse.json();
        setBookings(bookingsData);

        // Fetch events (to get event titles)
        const eventsResponse = await fetch('http://localhost:5000/api/events');
        if (!eventsResponse.ok) {
          throw new Error(`HTTP error! status: ${eventsResponse.status} for events`);
        }
        const eventsData: EventSummary[] = await eventsResponse.json();
        setEvents(eventsData.map(event => ({ id: event.id, title: event.title })));

      } catch (e: any) {
        setError(e.message);
        toast({
          title: "Error fetching data",
          description: e.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsAndEvents();
  }, [toast]);

  const getEventTitle = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-gray-700">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-red-500">Error: {error}</p>
        <Link to="/">
          <Button className="mt-4 bg-green-600 hover:bg-green-700">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-10">
            <p className="mb-4">You don't have any bookings yet.</p>
            <Link to="/">
              <Button className="bg-green-600 hover:bg-green-700">Discover Events</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <Card key={booking.id} className="overflow-hidden shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{getEventTitle(booking.event_id)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  <p><strong>Name:</strong> {booking.user_name}</p>
                  <p><strong>Email:</strong> {booking.user_email}</p>
                  <p><strong>Phone:</strong> {booking.user_phone}</p>
                  <p><strong>Tickets:</strong> {booking.num_tickets}</p>
                  <p><strong>Total Price:</strong> KES {booking.total_price.toLocaleString('en-KE')}</p>
                  <p><strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
                  <p>
                    <strong>Payment Status:</strong>{' '}
                    <span className={`font-semibold ${
                      booking.payment_status === 'completed' ? 'text-green-600' :
                      booking.payment_status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
