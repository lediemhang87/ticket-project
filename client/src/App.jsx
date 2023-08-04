import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AddEvent from './pages/AddEvent'
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/addEvent" element={<AddEvent />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/event/:eventId" element={ <EventDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
    
  );
}

export default App;
