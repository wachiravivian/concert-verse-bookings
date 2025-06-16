// src/pages/Index.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you are using react-router-dom for navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventCard from '@/components/EventCard'; // If you've configured path aliases like 
import { SearchFilters } from "@/components/SearchFilters"; // Assuming this component exists
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react"; // Assuming Menu and Search are from lucide-react
import { useToast } from "@/components/ui/use-toast"; // Assuming shadcn/ui toast setup

// --- IMPORTANT: Updated Event Interface to match Database Schema ---
interface Event {
    eventId: number;      // Matches 'eventId' in DB
    name: string;         // Matches 'name' in DB
    description: string;  // Matches 'description' in DB
    eventDate: string;    // Matches 'eventDate' in DB
    venue: string;        // Matches 'venue' in DB
    ticketPrice: number;  // Matches 'ticketPrice' in DB
    dateCreated: string;  // Matches 'dateCreated' in DB
    lastUpdated: string;  // Matches 'lastUpdated' in DB

    // These fields are NOT in your provided DB schema and thus won't be fetched.
    // If you need them, you must add them to your MySQL 'Event' table.
    // For now, I'm commenting them out or removing them from filtering logic.
    // artist?: string;
    // time?: string; // eventDate should contain date and time
    // location?: string; // venue should cover this
    // image?: string; // You might add a column for this if you store image URLs
    // category?: string; // You might add a column for this
    // rating?: number;
    // attendees?: number;
}

const Index = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // --- State for filters, matching EventList.tsx example ---
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedDate, setSelectedDate] = useState<string>("any-date");
    const [selectedLocation, setSelectedLocation] = useState<string>("any-location");
    const [selectedPrice, setSelectedPrice] = useState<string>("any-price");

    const { toast } = useToast();

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Adjust to your backend API endpoint for events
                const response = await fetch('http://localhost:5000/api/events');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Event[] = await response.json();
                setEvents(data);
            } catch (e: any) {
                setError(e.message);
                toast({
                    title: "Error fetching events",
                    description: e.message,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [toast]); // `toast` is stable, so adding it here is fine.

    // --- Filter Logic ---
    const filteredEvents = events.filter((event) => {
        // Basic search by name/venue (adjust if you add artist, etc. back to DB)
        const matchesSearch =
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Use event.name
            event.venue.toLowerCase().includes(searchQuery.toLowerCase());

        // --- Date Filtering (Replicated from EventList.tsx example) ---
        const today = new Date();
        let matchesDate = true;
        if (selectedDate === "today") {
            const eventDate = new Date(event.eventDate);
            matchesDate = (
                eventDate.getDate() === today.getDate() &&
                eventDate.getMonth() === today.getMonth() &&
                eventDate.getFullYear() === today.getFullYear()
            );
        } else if (selectedDate === "tomorrow") {
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            const eventDate = new Date(event.eventDate);
            matchesDate = (
                eventDate.getDate() === tomorrow.getDate() &&
                eventDate.getMonth() === tomorrow.getMonth() &&
                eventDate.getFullYear() === tomorrow.getFullYear()
            );
        } else if (selectedDate === "this-week") {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const eventDate = new Date(event.eventDate);
            matchesDate = eventDate >= startOfWeek && eventDate <= endOfWeek;
        } else if (selectedDate === "this-month") {
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            const eventDate = new Date(event.eventDate);
            matchesDate = (
                eventDate.getMonth() === currentMonth &&
                eventDate.getFullYear() === currentYear
            );
        }

        // --- Price Filtering (Replicated from EventList.tsx example) ---
        let matchesPrice = true;
        if (selectedPrice === "under-20") {
            matchesPrice = event.ticketPrice < 20;
        } else if (selectedPrice === "20-40") {
            matchesPrice = event.ticketPrice >= 20 && event.ticketPrice <= 40;
        } else if (selectedPrice === "40-80") {
            matchesPrice = event.ticketPrice > 40 && event.ticketPrice <= 80;
        } else if (selectedPrice === "over-80") {
            matchesPrice = event.ticketPrice > 80;
        }

        // --- Category Filtering (Only if you add 'category' to your Event DB table) ---
        // For now, assuming you don't have a 'category' column in the DB, this will always be true or needs to be removed.
        // If you add category, uncomment and adjust `event.category` to match.
        // const matchesCategory = selectedCategory === "all" || event.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesCategory = true; // Placeholder if no category field in DB

        // If you were to add location filtering back based on a DB column:
        // const matchesLocation = selectedLocation === "any-location" || event.location.toLowerCase() === selectedLocation.toLowerCase();

        return matchesSearch && matchesCategory && matchesDate && matchesPrice;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center text-2xl font-bold text-green-700">
                        {/* Ensure this path is correct if you have a logo */}
                        <img src="/placeholder.svg" alt="EventBooker Kenya Logo" className="h-8 w-8 mr-2" />
                        EventBooker Kenya
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/events" className="text-gray-600 hover:text-green-700 transition-colors">Events</Link>
                        <Link to="/venues" className="text-gray-600 hover:text-green-700 transition-colors">Venues</Link>
                        <Link to="/my-bookings" className="text-gray-600 hover:text-green-700 transition-colors">My Bookings</Link>
                        <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">Sign In</Button>
                        <Button className="bg-green-600 hover:bg-green-700">Sign Up</Button>
                    </nav>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <nav className="flex flex-col gap-4 py-6">
                                <Link to="/events" className="text-gray-600 hover:text-green-700 transition-colors">Events</Link>
                                <Link to="/venues" className="text-gray-600 hover:text-green-700 transition-colors">Venues</Link>
                                <Link to="/my-bookings" className="text-gray-600 hover:text-green-700 transition-colors">My Bookings</Link>
                                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 w-full">Sign In</Button>
                                <Button className="bg-green-600 hover:bg-green-700 w-full">Sign Up</Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-green-50 to-green-100 py-20 text-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                        Discover Amazing <span className="text-green-700">Events & Concerts</span> in Kenya
                    </h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
                        Book tickets for the best concerts, festivals, and events across Kenya. From intimate venues to massive festivals in Nairobi, Mombasa, Kisumu and more.
                    </p>
                    <div className="max-w-xl mx-auto flex items-center bg-white rounded-full shadow-lg p-1">
                        <Search className="h-5 w-5 text-gray-400 ml-4" />
                        <Input
                            type="text"
                            placeholder="Search events, artists, venues..."
                            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button className="bg-green-600 hover:bg-green-700 rounded-full px-6 py-2">
                            Search
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="mb-8">
                    {/* Ensure SearchFilters component can handle these props */}
                    <SearchFilters
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        // Add these if your SearchFilters component uses them
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        selectedLocation={selectedLocation}
                        onLocationChange={setSelectedLocation}
                        selectedPrice={selectedPrice}
                        onPriceChange={setSelectedPrice}
                    />
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* --- IMPORTANT: Use eventId from the database for the key --- */}
                        {filteredEvents.map((event) => (
                            <EventCard key={event.eventId} event={event} />
                        ))}
                    </div>
                    {filteredEvents.length === 0 && (
                        <p className="text-center text-gray-600 text-lg py-10">No events found matching your criteria.</p>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; {new Date().getFullYear()} EventBooker Kenya. All rights reserved.</p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
                        <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
                        <Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Index;