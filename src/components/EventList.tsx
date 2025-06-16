// client/src/components/EventList.tsx
import React, { useEffect, useState } from 'react';
import EventCard from '@/components/EventCard'; // If you've configured path aliases like @
interface Event {
  eventId: number;
  name: string;
  description: string;
  eventDate: string;
  venue: string;
  ticketPrice: number;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Frontend will proxy this to http://localhost:5000/api/events
        const response = await fetch('/api/events'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (events.length === 0) {
    return <div className="text-center text-gray-600">No upcoming events found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard key={event.eventId} event={event} />
      ))}
    </div>
  );
};

export default EventList;