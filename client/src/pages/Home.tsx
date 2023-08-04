// src/App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
  eventDetail: string;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Event[]>(
          "https://ticketproj.onrender.com/events"
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>My Event App</h1>
      <h2>Event List</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div>
          {events.map((event) => (
            <div className="border rounded p-2" key={event._id}>
              <Link to={`/event/${event._id}`}>
                <strong>{event.eventName}</strong> <br />
                {event.eventDate} <br />
                {event.eventDetail}
              </Link>
            </div>
          ))}
        </div>
      )}

      <Link to="/addevent">
        {" "}
        <button> Add Event </button>
      </Link>
      <br />
      <Link to="/signup">
        {" "}
        <button>Register Account </button>
      </Link>
      <br />
      <Link to="/signin">
        {" "}
        <button> Sign In </button>
      </Link>
      <br />
    </div>
  );
};

export default Home;
