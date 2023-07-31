// const express = require("express");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;
// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };
// mongoose
//   .connect(process.env.MONGODB_URL, options)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// const UserSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   phoneNumber: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const User = mongoose.model("users", UserSchema);

// app.use(express.json());

// app.use(cors());

// app.get("/", async (req, res) => {
//   try {
//     // Find all users in the database
//     const users = await User.find({});

//     // If no users found, send an empty array as the response
//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: "No users found" });
//     }

//     // Send the users as the response
//     res.status(200).json(users);
//   } catch (e) {
//     console.error("Error:", e);
//     res.status(500).json({ message: "Something Went Wrong" });
//   }
// });

// app.post("/register", async (req, res) => {
//   try {
//     const { firstName, lastName, email, phoneNumber, password } = req.body;

//     // Hash the password before saving it to the database
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       password: hashedPassword,
//     });

//     let result = await user.save();
//     result = result.toObject();
//     if (result) {
//       delete result.password;
//       res.status(201).send(result);
//       console.log(result);
//     } else {
//       console.log("User already registered");
//       res.status(409).send("User already registered");
//     }
//   } catch (e) {
//     console.error("Error:", e);
//     res.status(500).send("Something Went Wrong");
//   }
// });

// app.post("/signin", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user with the given email
//     const user = await User.findOne({ email });

//     // If the user doesn't exist, send an error response
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Compare the provided password with the hashed password stored in the database
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     // If the password doesn't match, send an error response
//     if (!passwordMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Password matches, send success response
//     res.status(200).json({ message: "Signed in successfully" });
//   } catch (e) {
//     console.error("Error:", e);
//     res.status(500).json({ message: "Something Went Wrong" });
//   }
// });

// app.listen(port, () => {
//   console.log(`App is listening on port ${port}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
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

app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Hash the password before saving it to the database
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
