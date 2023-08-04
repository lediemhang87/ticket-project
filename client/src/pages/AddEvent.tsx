import React, { useState, FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const AddEvent: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState<string>(""); // Changed the type to string
  const [eventDetail, setEventDetail] = useState("");
  const [ticketTypes, setTicketTypes] = useState([{ name: "", price: "" }]);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formattedDate = eventDate; // No need to format the date here

      const ticketTypesWithValidPrices = ticketTypes.map((ticket) => ({
        name: ticket.name,
        price: parseFloat(ticket.price) || 0,
      }));

      const result = await fetch("https://ticketproj.onrender.com/events", {
        method: "POST",
        body: JSON.stringify({
          eventName,
          eventDate: formattedDate,
          eventDetail,
          ticketStartDate: "2023-08-03", // Replace this with the appropriate value
          ticketEndDate: "2023-08-03", // Replace this with the appropriate value
          ticketTypes: ticketTypesWithValidPrices,
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
        setTicketTypes([{ name: "", price: "" }]);
      } else {
        alert("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const handleTicketTypeChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedTicketTypes = [...ticketTypes];
    updatedTicketTypes[index][field] = value;
    setTicketTypes(updatedTicketTypes);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: "", price: "" }]);
  };

  return (
    <div className="container">
      <h1> Add new event </h1>
      <form onSubmit={handleOnSubmit}>
        <div className="form-group">
          <label htmlFor="eventName">Event Name</label>
          <input
            type="text"
            id="eventName"
            className="form-control"
            placeholder="Event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventDate">Event Date</label>
          <br />
          <DatePicker
            id="eventDate"
            className="form-control"
            placeholderText="Choose date"
            selected={eventDate}
            onChange={(date) => setEventDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventDetail">Event Detail</label>
          <input
            type="text"
            id="eventDetail"
            className="form-control"
            placeholder="Event Detail"
            value={eventDetail}
            onChange={(e) => setEventDetail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Ticket Types</label> <br/>
          <button
            type="button"
            className="btn btn-primary "
            onClick={addTicketType}
          >
            + Add Ticket Type
          </button>
          {ticketTypes.map((ticket, index) => (
            <div key={index} className="row mb-2">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ticket Type Name"
                  value={ticket.name}
                  onChange={(e) =>
                    handleTicketTypeChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ticket Type Price"
                  value={ticket.price}
                  onChange={(e) =>
                    handleTicketTypeChange(index, "price", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <br />
        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
      <br />
      <br />
      <div className="mt-3">
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AddEvent;
