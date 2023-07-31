import React, { useState, FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SignUp: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDetail, setEventDetail] = useState("");

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await fetch("https://ticketproj.onrender.com/events", {
        method: "POST",
        body: JSON.stringify({
          eventName,
          eventDate,
          eventDetail,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await result.json();
      console.warn(data);
      if (result.ok) {
        alert("Data saved successfully");
        setEventName("");
        setEventDate("");
        setEventDetail("");
      } else {
        alert("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <h1>This is React WebApp</h1>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="Event name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <DatePicker
          placeholder="Choose date"
          selected={eventDate}
          onChange={(date) => setEventDate(date)}
          dateFormat="yyyy-MM-dd"
        />
        <input
          type="text"
          placeholder="Event Detail"
          value={eventDetail}
          onChange={(e) => setEventDetail(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default SignUp;
