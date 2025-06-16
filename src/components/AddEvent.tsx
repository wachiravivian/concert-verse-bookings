// src/components/AddEvent.tsx

import React, { useState } from 'react';

const AddEvent = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      event_name: eventName,
      event_date: eventDate,
      location: eventLocation,
    };

    try {
      const res = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Event added successfully:', data);
      } else {
        console.error('Failed to add event:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4 mb-6 border rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Add a New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="eventName" className="block text-lg">Event Name</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-2 mt-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="eventDate" className="block text-lg">Event Date</label>
          <input
            type="date"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-2 mt-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="eventLocation" className="block text-lg">Event Location</label>
          <input
            type="text"
            id="eventLocation"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="w-full p-2 mt-2 border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">Add Event</button>
      </form>
    </div>
  );
};

export default AddEvent;
