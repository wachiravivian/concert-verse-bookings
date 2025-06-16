// src/pages/Venues.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Users } from 'lucide-react'; // Assuming you might use Users for capacity
import { useToast } from "@/components/ui/use-toast";

interface Venue {
  id: number;
  name: string;
  location: string;
  capacity?: number; // Optional
  image?: string;    // Optional
  description?: string; // Optional
}

const Venues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/venues');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Venue[] = await response.json();
        setVenues(data);
      } catch (e: any) {
        setError(e.message);
        toast({
          title: "Error fetching venues",
          description: e.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-gray-700">Loading venues...</p>
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
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Our Amazing Venues</h1>
        {venues.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-10">
            No venues are currently listed.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={venue.image || `https://placehold.co/400x250/008000/ffffff?text=${venue.name.replace(/\s/g, '+')}`}
                    alt={venue.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/400x250/008000/ffffff?text=${venue.name.replace(/\s/g, '+')}`; }}
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1">{venue.name}</CardTitle>
                  <CardDescription className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> {venue.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  {venue.capacity && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" /> Capacity: {venue.capacity.toLocaleString()}
                    </div>
                  )}
                  {venue.description && (
                    <p className="text-gray-600 line-clamp-3">{venue.description}</p>
                  )}
                  <Link to={`/venues/${venue.id}`} className="block mt-4">
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;
