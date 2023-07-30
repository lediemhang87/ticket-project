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

const User = mongoose.model("users", UserSchema);

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("App is Working");
});

app.post("/register", async (req, res) => {
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

    let result = await user.save();
    result = result.toObject();
    if (result) {
      delete result.password;
      res.status(201).send(result);
      console.log(result);
    } else {
      console.log("User already registered");
      res.status(409).send("User already registered");
    }
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send("Something Went Wrong");
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
