// server/routes/bookings.js
const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const axios = require('axios'); // For making HTTP requests to M-Pesa API
const crypto = require('crypto'); // For generating timestamp and password

// Database connection pool (re-use from server.js)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// M-Pesa Daraja API Base URL (Sandbox)
const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';

// Function to generate M-Pesa API access token
const getAccessToken = async () => {
    try {
        const auth = Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
        ).toString('base64');

        const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting M-Pesa access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get M-Pesa access token.');
    }
};

// GET /api/bookings/ - Fetch all bookings (assuming this refers to EventTicket now)
router.get('/', async (req, res) => {
    try {
        // Changed to EventTicket table and relevant columns
        const [rows] = await pool.query('SELECT eventTicketId, eventId, customerName, phoneNumber, emailAddress, quantity, totalAmount, paymentStatus, mpesaReceiptNumber, transactionDate, dateCreated, lastUpdated FROM EventTicket');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching bookings (EventTicket):', error);
        res.status(500).json({ message: 'Failed to fetch bookings.', error: error.message });
    }
});

// POST /api/bookings - Create a new booking record (Payment status initially 'Pending')
router.post('/', async (req, res) => {
    // *** CHANGE THESE NAMES TO MATCH FRONTEND ***
    const { eventId, customerName, emailAddress, phoneNumber, quantity } = req.body;

    // Validate incoming data
    if (!eventId || !customerName || !emailAddress || !phoneNumber || !quantity) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const phoneRegex = /^(254|\+254)\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) { // Use phoneNumber
        return res.status(400).json({ message: 'Invalid phone number format. Must be 254xxxxxxxxx or +254xxxxxxxxx (9 digits after 254).' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // *** CHANGE TABLE AND COLUMN NAMES TO MATCH YOUR DB SCHEMA ***
        const [events] = await connection.execute(
            'SELECT ticketPrice, name FROM Event WHERE eventId = ?', // Use Event table and eventId, ticketPrice, name
            [eventId] // Use eventId
        );

        if (events.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Event not found.' });
        }

        const eventPrice = parseFloat(events[0].ticketPrice); // Use ticketPrice
        const eventName = events[0].name; // Use name
        const totalPrice = eventPrice * parseInt(quantity); // Use quantity and parse it to int

        // *** INSERT INTO EventTicket TABLE with correct column names ***
        const [result] = await connection.execute(
            'INSERT INTO EventTicket (eventId, customerName, phoneNumber, emailAddress, quantity, totalAmount, paymentStatus, transactionDate, dateCreated, lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [eventId, customerName, phoneNumber, emailAddress, parseInt(quantity), totalPrice, 'PENDING', null] // transactionDate is initially null
        );

        const eventTicketId = result.insertId; // Get the newly created ID

        // --- Initiate M-Pesa STK Push (INTEGRATED HERE AS PER YOUR FRONTEND) ---
        const amount = Math.round(totalPrice); // Use the calculated totalPrice
        const cleanPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber; // Remove '+' if present
        const shortCode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const callbackUrl = process.env.MPESA_CALLBACK_URL; // This needs to be publicly accessible

        if (!shortCode || !passkey || !callbackUrl) {
            await connection.rollback();
            console.error('M-Pesa credentials or callback URL are not configured in .env');
            return res.status(500).json({ message: 'M-Pesa payment gateway not fully configured.' });
        }

        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

        const stkPushPayload = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: cleanPhoneNumber, // Use the cleaned phone number
            PartyB: shortCode,
            PhoneNumber: cleanPhoneNumber, // Use the cleaned phone number
            CallBackURL: callbackUrl,
            AccountReference: `EventBooking-${eventTicketId}`, // Use eventTicketId as reference
            TransactionDesc: `Payment for ${eventName} tickets`, // Use eventName
        };

        const accessToken = await getAccessToken();

        const stkPushResponse = await axios.post(
            `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
            stkPushPayload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const { CheckoutRequestID, CustomerMessage, ResponseCode, ResponseDescription } = stkPushResponse.data;

        if (ResponseCode === '0') {
            // Store PushRequest details (use 'push_requests' table and correct columns)
            // You might need to update EventTicket with CheckoutRequestID or have a separate push_requests table
            // Based on your previous schema image_3da6cf.png, eventTicketId is the primary key for EventTicket table.
            // If you have a separate `push_requests` table, ensure its schema matches `(booking_id, checkout_request_id)`
            // For now, let's assume `push_requests` table with `booking_id` as `eventTicketId`
            await connection.execute(
                'INSERT INTO PushRequest (eventTicketId, checkoutRequestId, dateCreated, lastUpdated) VALUES (?, ?, NOW(), NOW())',
                [eventTicketId, CheckoutRequestID]
            );
            await connection.commit(); // Commit transaction only if STK push is considered initiated successfully

            res.status(201).json({ // Changed to 201 for resource created
                message: CustomerMessage || "STK Push initiated successfully. Please check your phone.",
                eventTicketId: eventTicketId, // Return eventTicketId
                checkoutRequestId: CheckoutRequestID,
                responseDescription: ResponseDescription
            });
        } else {
            // STK push failed, rollback the ticket creation
            await connection.rollback();
            console.error('STK Push initiation failed:', stkPushResponse.data);
            res.status(500).json({ // Changed to 500 as STK push failed on server side
                message: 'Failed to initiate M-Pesa STK Push.',
                error: ResponseDescription || CustomerMessage,
            });
        }

    } catch (error) {
        if (connection) {
            await connection.rollback(); // Rollback on any error
        }
        console.error('Backend: Error in booking route:', error.response ? error.response.data : error.message);
        res.status(500).json({
            message: 'Booking creation failed due to server error.',
            error: error.response ? error.response.data : error.message,
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


// POST /api/bookings/mpesa-callback - M-Pesa Callback endpoint
router.post('/mpesa-callback', async (req, res) => {
    console.log('M-Pesa Callback Received:');
    console.log(JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    const { stkCallback } = Body || {};

    if (!stkCallback) {
        console.error('Invalid STK Callback received:', req.body);
        return res.json({ ResultCode: 1, ResultDesc: 'Invalid callback format' });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    let paymentStatus = 'Failed'; // Changed from transactionStatus to paymentStatus to match DB
    let mpesaReceiptNumber = null;
    let transactionDate = null;
    let amountPaid = null; // Add amountPaid

    if (ResultCode === 0) { // Success
        paymentStatus = 'Paid';
        const mpesaReceiptItem = CallbackMetadata?.Item.find((i) => i.Name === 'MpesaReceiptNumber');
        mpesaReceiptNumber = mpesaReceiptItem?.Value || null;

        const dateItem = CallbackMetadata?.Item.find((i) => i.Name === 'TransactionDate');
        if (dateItem && dateItem.Value) {
            const dateString = String(dateItem.Value);
            transactionDate = `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)} ` +
                              `${dateString.substring(8, 10)}:${dateString.substring(10, 12)}:${dateString.substring(12, 14)}`;
        }

        const amountItem = CallbackMetadata?.Item.find((i) => i.Name === 'Amount');
        amountPaid = amountItem?.Value || null;
    } else {
        paymentStatus = 'Failed';
        console.error(`Payment failed for CheckoutRequestID ${CheckoutRequestID}: ${ResultDesc}`);
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Find the EventTicket associated with this CheckoutRequestID in PushRequest table
        const [pushRequests] = await connection.execute(
            'SELECT eventTicketId FROM PushRequest WHERE checkoutRequestId = ?', // Use PushRequest and eventTicketId
            [CheckoutRequestID]
        );

        if (pushRequests.length === 0) {
            console.error(`EventTicket not found for CheckoutRequestID: ${CheckoutRequestID}`);
            await connection.rollback();
            return res.json({ ResultCode: 1, ResultDesc: 'EventTicket not found' });
        }

        const eventTicketId = pushRequests[0].eventTicketId; // Use eventTicketId

        // Update EventTicket status with correct column names
        await connection.execute(
            'UPDATE EventTicket SET paymentStatus = ?, mpesaReceiptNumber = ?, transactionDate = ?, amountPaid = ? WHERE eventTicketId = ?',
            [paymentStatus, mpesaReceiptNumber, transactionDate, amountPaid, eventTicketId]
        );

        await connection.commit();
        console.log(`EventTicket ${eventTicketId} updated to status: ${paymentStatus}`);
        res.json({ ResultCode: 0, ResultDesc: 'Callback received and processed successfully' });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error processing M-Pesa callback:', error.message);
        res.status(500).json({ ResultCode: 1, ResultDesc: 'Internal server error processing callback' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Remove /api/bookings/make-payment endpoint if POST /api/bookings now handles STK push
// If you want to keep it separate, then the frontend should first call /api/bookings
// then if successful, get the bookingId and then call /api/bookings/make-payment
// For this setup, I've integrated payment initiation directly into POST /api/bookings.
// If you remove it, ensure your frontend's handleBookingAndPayment correctly handles the combined logic.
// If you keep it separate, the frontend's logic needs to change to two fetch calls.
// The current BookingForm.tsx expects one call to /api/bookings to do both.
// So, removing the separate `make-payment` route makes sense for your current frontend.


// POST /api/bookings/query-payment-status - Query M-Pesa STK Push status
// This route is fine as it uses checkoutRequestId which is consistent.
router.post('/query-payment-status', async (req, res) => {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
        return res.status(400).json({ message: 'checkoutRequestId is required.' });
    }

    try {
        const shortCode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;

        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

        const queryPayload = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId,
        };

        const accessToken = await getAccessToken();

        const queryResponse = await axios.post(
            `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
            queryPayload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        res.status(200).json(queryResponse.data);
    } catch (error) {
        console.error('Error querying M-Pesa payment status:', error.response ? error.response.data : error.message);
        res.status(500).json({
            message: 'Failed to query M-Pesa payment status.',
            error: error.response ? error.response.data : error.message,
        });
    }
});

module.exports = router;