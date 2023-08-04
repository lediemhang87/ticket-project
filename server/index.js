const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

const port = process.env.PORT || 5000;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGODB_URL, options)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const TicketTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: String, // Changed the type to string
    required: true,
  },
  eventDetail: {
    type: String,
    required: true,
  },
  ticketStartDate: {
    type: String, // Changed the type to string
    required: true,
  },
  ticketEndDate: {
    type: String, // Changed the type to string
    required: true,
  },
  ticketTypes: [TicketTypeSchema],
});

const User = mongoose.model("User", UserSchema);
const Event = mongoose.model("Event", EventSchema);
const TicketType = mongoose.model("TicketType", TicketTypeSchema);

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const accessToken = generateAccessToken(user);
      res.json({ message: "Login successful", accessToken });
    } else {
      res.json({ message: "Invalid email or password" });
      return;
    }
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

const authenticateToken = (req, res, next) => {
  const accessToken = req.header("Authorization")?.split(" ")[1];
  if (!accessToken) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

app.get("/check-auth", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/logout", (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

app.post("/events", async (req, res) => {
  try {
    const { eventName, eventDate, eventDetail, ticketStartDate, ticketEndDate, ticketTypes } = req.body;

    console.log("Received data from the client:", req.body);

    const event = new Event({
      eventName,
      eventDate: new Date(eventDate),
      eventDetail,
      ticketStartDate: new Date(ticketStartDate),
      ticketEndDate: new Date(ticketEndDate),
      ticketTypes,
    });

    const savedEvent = await event.save();

    console.log("Event saved successfully:", savedEvent);

    res.status(201).json(savedEvent);
  } catch (e) {
    console.error("Error saving event:", e);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
