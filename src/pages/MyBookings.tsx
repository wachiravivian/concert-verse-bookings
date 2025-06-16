// src/pages/MyBookings.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast"; // For displaying notifications

// --- IMPORTANT: Corrected Booking Interface to match EventTicket DB Schema ---
interface Booking {
    eventTicketId: number;       // Matches 'eventTicketId' in DB
    eventId: number;             // Matches 'eventId' in DB
    customerName: string;        // Matches 'customerName' in DB
    phoneNumber: string;         // Matches 'phoneNumber' in DB (was user_phone)
    emailAddress: string;        // Matches 'emailAddress' in DB (was user_email)
    quantity: number;            // Matches 'quantity' in DB (was num_tickets)
    totalAmount: number;         // Matches 'totalAmount' in DB (was total_price)
    paymentStatus: 'PENDING' | 'Paid' | 'Failed'; // Matches 'paymentStatus' in DB, use exact casing
    mpesaReceiptNumber: string | null; // Matches 'mpesaReceiptNumber' in DB
    transactionDate: string | null; // Matches 'transactionDate' in DB
    dateCreated: string;         // Matches 'dateCreated' in DB
    lastUpdated: string;         // Matches 'lastUpdated' in DB
    amountPaid: number | null; // From `mpesa-callback` update
}

// --- IMPORTANT: Corrected EventSummary Interface to match Event DB Schema ---
interface EventSummary {
    eventId: number; // Matches 'eventId' in DB
    name: string;    // Matches 'name' in DB (was title)
}

const MyBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchBookingsAndEvents = async () => {
            try {
                // Fetch bookings from your /api/bookings endpoint (which queries EventTicket)
                const bookingsResponse = await fetch('http://localhost:5000/api/bookings');
                if (!bookingsResponse.ok) {
                    throw new Error(`HTTP error! status: ${bookingsResponse.status} for bookings`);
                }
                // Cast the response data to the corrected Booking[] interface
                const bookingsData: Booking[] = await bookingsResponse.json();
                setBookings(bookingsData);

                // Fetch events from your /api/events endpoint (which queries Event)
                const eventsResponse = await fetch('http://localhost:5000/api/events');
                if (!eventsResponse.ok) {
                    throw new Error(`HTTP error! status: ${eventsResponse.status} for events`);
                }
                // Cast the response data to the corrected EventSummary[] interface
                const eventsData: EventSummary[] = await eventsResponse.json();
                // Map the event data to match the EventSummary interface expected by getEventTitle
                setEvents(eventsData.map(event => ({ eventId: event.eventId, name: event.name })));

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
        // Find the event using eventId, and return its name
        const event = events.find(e => e.eventId === eventId);
        return event ? event.name : 'Unknown Event';
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
                            // Use booking.eventTicketId as the key
                            <Card key={booking.eventTicketId} className="overflow-hidden shadow-md">
                                <CardHeader>
                                    {/* Use getEventTitle with booking.eventId */}
                                    <CardTitle className="text-lg">{getEventTitle(booking.eventId)}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm text-gray-700">
                                    {/* Use corrected property names from the Booking interface */}
                                    <p><strong>Name:</strong> {booking.customerName}</p>
                                    <p><strong>Email:</strong> {booking.emailAddress}</p>
                                    <p><strong>Phone:</strong> {booking.phoneNumber}</p>
                                    <p><strong>Tickets:</strong> {booking.quantity}</p>
                                    <p><strong>Total Price:</strong> KES {booking.totalAmount.toLocaleString('en-KE')}</p>
                                    {/* Display transaction date if available */}
                                    {booking.transactionDate && (
                                        <p><strong>Transaction Date:</strong> {new Date(booking.transactionDate).toLocaleDateString()} {new Date(booking.transactionDate).toLocaleTimeString()}</p>
                                    )}
                                    {/* Display booking date (dateCreated) */}
                                    <p><strong>Booking Created:</strong> {new Date(booking.dateCreated).toLocaleDateString()} {new Date(booking.dateCreated).toLocaleTimeString()}</p>
                                    <p>
                                        <strong>Payment Status:</strong>{' '}
                                        <span className={`font-semibold ${
                                            // Ensure casing matches your DB (e.g., 'Paid', 'PENDING', 'Failed')
                                            booking.paymentStatus === 'Paid' ? 'text-green-600' :
                                            booking.paymentStatus === 'PENDING' ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                        </span>
                                    </p>
                                    {booking.mpesaReceiptNumber && (
                                        <p><strong>M-Pesa Receipt:</strong> {booking.mpesaReceiptNumber}</p>
                                    )}
                                    {booking.amountPaid !== null && (
                                        <p><strong>Amount Paid:</strong> KES {booking.amountPaid.toLocaleString('en-KE')}</p>
                                    )}
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