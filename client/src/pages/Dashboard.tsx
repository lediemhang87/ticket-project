import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch user data from backend
    fetchUserData();
    // Fetch events data from backend
    fetchEventsData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<User>("https://ticketproj.onrender.com/user"); // Replace with your backend user endpoint
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchEventsData = async () => {
    try {
      const response = await axios.get<Event[]>("https://ticketproj.onrender.com/events"); // Replace with your backend events endpoint
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events data:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {user && (
        <div>
          <h2>User Details</h2>
          <p>Name: {user.firstName} {user.lastName}</p>
          <p>Email: {user.email}</p>
          <p>Phone Number: {user.phoneNumber}</p>
        </div>
      )}
      {events.length > 0 && (
        <div>
          <h2>Events</h2>
          <ul>
            {events.map((event) => (
              <li key={event._id}>
                <strong>{event.eventName}</strong> - {event.eventDate}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
