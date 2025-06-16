import express from 'express';
import { db } from './src/lib/db.js';  // Path to your DB file

const app = express();
app.use(express.json());  // Allow JSON payload in requests

// Endpoint to insert multiple events
app.post("/api/insert-events", (req, res) => {
  const events = [
    {
      event_name: "Nairobi Jazz Festival",
      event_date: "2025-06-10",
      location: "nairobi",
      venue: "KICC Grounds",
      artist: "Jazz Collective",
      price: 35,
      image: "/images/jazz-eventbooker.jpg",
      category: "music",
    },
    {
      event_name: "Tech Expo 2025",
      event_date: "2025-06-11",
      location: "nairobi",
      venue: "Sarit Centre Expo Hall",
      artist: "Tech Talks KE",
      price: 10,
      image: "/images/tech-expo.jpg",
      category: "conference",
    },
    {
      event_name: "Summertides",
      event_date: "2025-07-12",
      location: "mombasa",
      venue: "Diani",
      artist: "DJ Brit",
      price: 50,
      image: "/images/summertides.jpg",
      category: "music",
    },
    {
      event_name: "Nairobi Street Food Festival",
      event_date: "2025-06-07",
      location: "nairobi",
      venue: "Jamhuri Show Ground, Main Arena",
      artist: "Mutoriah",
      price: 15,
      image: "/images/NFF.jpg",
      category: "art",
    },
  ];

  // Insert the events into the database
  const sql = `
  INSERT INTO events (event_name, event_date, location, venue, artist, price, image, category)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;


  events.forEach((event) => {
    db.query(
      sql,
      [
        event.event_name,
        event.event_date,
        event.location,
        event.venue,
        event.artist,
        event.price,
        event.image,
        event.category,
      ],
      (err, result) => {
        if (err) {
          console.error("❌ DB Insert Error:", err);
          return res.status(500).json({ error: "Database insert failed" });
        }
        console.log("✅ Event inserted with ID:", result.insertId);
      }
    );
  });

  res.json({ message: "Events inserted successfully!" });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});