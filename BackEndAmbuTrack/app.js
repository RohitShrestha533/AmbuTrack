const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cors = require("cors");
app.use(cors()); // Enable CORS for all routes
const session = require("express-session");

app.use(
  session({
    secret: "2019/08/26", // A secret key for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if you're using HTTPS
  })
);

const mongoose = require("mongoose");
app.use(express.json());
const mongoUrl =
  "mongodb+srv://shrestharohit533:admin@cluster0.86mjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send("hi");
});

require("./UserModel");
const User = mongoose.model("userInfo");

app.post("/userLogin", async (req, res) => {
  const { email, password, role } = req.body;
  let user;

  // Determine which collection to query based on role
  if (role === "user") {
    user = await User.findOne({ email: email });
  }

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  // Compare the entered password with the stored hashed password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Incorrect password" });
  }

  try {
    if (user && isPasswordCorrect) {
      req.session.userId = user._id; // Store user ID in session
      res.status(200).send({ status: 200, message: "Login successful" }); // Return status code and message
    } else {
      res.status(400).send({ status: 400, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

app.post("/userLogout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: "Failed to log out" });
    }
    res.status(200).send({ message: "Logged out successfully" });
  });
});

app.post("/userRegister", async (req, res) => {
  const { email, phone, password, confirmpassword } = req.body;

  // Validate phone number (ensure it's exactly 10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send({ message: "Phone number must be 10 digits." });
  }

  if (password != confirmpassword) {
    return res.status(400).send({ message: "Passwords do not match." });
  }
  const oldUser = await User.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (oldUser) {
    return res.status(400).send({ message: "user already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await User.create({
      email: email,
      phone,
      password: hashedPassword,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

const host = "0.0.0.0"; // or your local IP like "192.168.1.100"
const port = 3000;

app.listen(port, host, () => {
  console.log(
    `Node js server started Server running at http://${host}:${port}`
  );
});
