import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
interface TicketType {
  name: string;
  price: number;
}

interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
  eventDetail: string;
  ticketTypes: TicketType[];
}

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Event[]>(
          "https://ticketproj.onrender.com/events"
        );
        const events = response.data;
        const selectedEvent = events.find((event) => event._id === eventId);
        setEvent(selectedEvent || null);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Event Details</h2>
      <div className="border rounded p-2">
        <strong>{event.eventName}</strong> <br />
        {event.eventDate} <br />
        {event.eventDetail}
        <div>
          <strong>Ticket Types</strong>
          {event.ticketTypes.map((ticket, index) => (
            <div key={index}>
              <strong>{ticket.name}</strong> - Price: ${ticket.price}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  
  
  
  
  
};

export default EventDetails;
