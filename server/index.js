
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();
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

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  eventDetail: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);
const Event = mongoose.model("Event", EventSchema);

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "your-secret-key-here", // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.userId = user._id;
    res.status(200).json({ message: "Login successful" });
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

app.get("/check-auth", async (req, res) => {
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error:", err);
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

app.get("/user", async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    savedUser.password = undefined;

    res.status(201).json(savedUser);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ message: "Something Went Wrong" });
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
    const { eventName, eventDate, eventDetail } = req.body;

    const event = new Event({
      eventName,
      eventDate,
      eventDetail,
    });

    const savedEvent = await event.save();

    res.status(201).json(savedEvent);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
