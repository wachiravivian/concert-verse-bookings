// src/components/BookingForm.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast"; // Assuming you have shadcn/ui toast setup

interface BookingFormProps {
    eventId: number;
    eventName: string;       // Changed from eventTitle to eventName
    eventTicketPrice: number; // Changed from eventPrice to eventTicketPrice
    onBookingSuccess: () => void;
    onClose: () => void;
}

export const BookingForm = ({ eventId, eventName, eventTicketPrice, onBookingSuccess, onClose }: BookingFormProps) => {
    const [customerName, setCustomerName] = useState(''); // Matches DB
    const [emailAddress, setEmailAddress] = useState(''); // Matches DB
    const [phoneNumber, setPhoneNumber] = useState('');   // Matches DB
    const [quantity, setQuantity] = useState(1);         // Matches DB
    const [loading, setLoading] = useState(false);
    const [paymentInitiated, setPaymentInitiated] = useState(false); // State for payment process
    const { toast } = useToast();

    const totalAmount = eventTicketPrice * quantity; // Calculate total amount

    const handleBookingAndPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const phoneRegex = /^(254|\+254)\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast({
                title: "Invalid Phone Number",
                description: "Phone number must be in the format 254xxxxxxxxx or +254xxxxxxxxx (9 digits after 254).",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        try {
            // 4. Submit Booking Data & 5. Create EventTicket Record
            const bookingResponse = await fetch('http://localhost:5000/api/bookings', { // Point to your Express backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId,          // From props
                    customerName,     // From state
                    emailAddress,     // From state
                    phoneNumber,      // From state
                    quantity,         // From state
                    // totalAmount is calculated and used by backend
                }),
            });

            const bookingData = await bookingResponse.json();

            if (!bookingResponse.ok) {
                toast({
                    title: "Booking Creation Failed",
                    description: bookingData.message || "An error occurred during booking creation.",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            const { eventTicketId, message, checkoutRequestId, responseDescription } = bookingData; // Expect eventTicketId from backend

            // The backend now handles the STK push initiation directly within the /api/bookings route.
            // The response 'bookingData' should ideally contain success/failure of the STK push itself.
            // Based on the workflow, step 7 and 8 happen *after* step 5 in one backend call.

            if (bookingResponse.ok) { // If the overall booking/STK push call was successful
                toast({
                    title: "Payment Initiated",
                    description: message || "Please check your phone for the M-Pesa STK Push prompt.",
                    // variant: "success", // Uncomment if you have a success variant
                });
                setPaymentInitiated(true);
                onBookingSuccess(); // Call the success handler from EventCard
            } else {
                 // This else block might be redundant if the backend consistently sends !ok for failures.
                 // The initial !bookingResponse.ok check already handles this.
                 // Keep it for clarity or detailed client-side handling.
                toast({
                    title: "Payment Initiation Failed",
                    description: responseDescription || bookingData.error || "Could not initiate M-Pesa payment.",
                    variant: "destructive",
                });
            }

        } catch (error) {
            console.error('Frontend: Error during booking or payment:', error);
            toast({
                title: "Network Error",
                description: "Could not connect to the server or an unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleBookingAndPayment} className="space-y-4">
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event" className="text-right">
                        Event
                    </Label>
                    <Input id="event" defaultValue={eventName} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                        Price per ticket
                    </Label>
                    <Input id="price" defaultValue={`KES ${eventTicketPrice.toLocaleString('en-KE')}`} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="col-span-3"
                        required
                        disabled={loading || paymentInitiated}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="col-span-3"
                        required
                        disabled={loading || paymentInitiated}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                        Phone (254/+)
                    </Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g., 254712345678 or +254712345678"
                        className="col-span-3"
                        required
                        disabled={loading || paymentInitiated}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                        Number of Tickets
                    </Label>
                    <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        className="col-span-3"
                        required
                        disabled={loading || paymentInitiated}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 font-bold text-lg">
                    <Label className="text-right col-span-3">
                        Total Price:
                    </Label>
                    <div className="col-span-1">
                        KES {totalAmount.toLocaleString('en-KE')}
                    </div>
                </div>
            </div>
            <DialogFooter className="flex justify-end space-x-3 pt-4">
                {!paymentInitiated ? (
                    <>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                            {loading ? 'Processing...' : 'Confirm Booking & Pay'}
                        </Button>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-center text-gray-600">
                            Check your phone for the M-Pesa STK Push prompt.
                        </p>
                        <Button type="button" variant="outline" onClick={onClose}>Close</Button>
                    </>
                )}
            </DialogFooter>
        </form>
    );
};