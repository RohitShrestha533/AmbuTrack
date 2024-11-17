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
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust to your client URL
    credentials: true, // Allow sending of cookies
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

// select profile data
app.get("/UserData", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ message: "Not authenticated" });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log("Fetched user:", user);
    res.status(200).send({ user });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching user data", error: error.message });
  }
});
//update  user
app.put("/UpdateUser", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  const { fullname, email, gender, dob } = req.body;

  User.findByIdAndUpdate(
    req.session.userId,
    { fullname, email, gender, Dob: dob },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.json({ success: true, message: "User updated successfully", user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    });
});

require("./UserModel");
const User = mongoose.model("userInfo");

// login
app.post("/userLogin", async (req, res) => {
  const { email, password, role } = req.body;
  let user;

  if (role === "user") {
    user = await User.findOne({ email: email });
  }

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Incorrect password" });
  }

  try {
    if (user && isPasswordCorrect) {
      req.session.userId = user._id;
      res.status(200).send({ status: 200, message: "Login successful" });
    } else {
      res.status(400).send({ status: 400, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

//logout
app.post("/userLogout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: "Failed to log out" });
    }
    res.status(200).send({ message: "Logged out successfully" });
  });
});

//user register
app.post("/userRegister", async (req, res) => {
  const { email, phone, password, confirmpassword } = req.body;

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
      Dob: null,
      gender: null,
      fullname: null,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

const host = "0.0.0.0";
const port = 3000;

app.listen(port, host, () => {
  console.log(
    `Node js server started Server running at http://${host}:${port}`
  );
});
