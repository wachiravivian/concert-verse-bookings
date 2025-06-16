// At the top (after db connection)
import express from 'express';
import mysql from 'mysql2';
const router = express.Router();

// ... your db connection setup ...

// ✅ Booking route
router.post('/bookings', (req, res) => {
  const { event_id, full_name, mobile, email, tickets, total_price } = req.body;

  console.log('Received booking:', req.body);

  res.status(200).json({
    message: 'Booking successful',
    booking: { event_id, full_name, tickets, total_price },
  });
});

export default router;