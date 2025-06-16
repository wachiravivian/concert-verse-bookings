import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your page components
import Index from "./pages/Index";
import Events from "./pages/Events";        // <--- NEW
import Venues from "./pages/Venues";        // <--- NEW
import MyBookings from "./pages/MyBookings"; // <--- NEW
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/events" element={<Events />} />         {/* <--- NEW ROUTE */}
          <Route path="/venues" element={<Venues />} />         {/* <--- NEW ROUTE */}
          <Route path="/my-bookings" element={<MyBookings />} /> {/* <--- NEW ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
