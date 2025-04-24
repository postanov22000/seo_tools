const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Mock database (replace with real DB)
const users = [
  {
    email: "test@example.com",
    password: "$2b$10$hashedPassword123" // Hashed with bcrypt
  }
];

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user in DB
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).send("Invalid email/password");

  // 2. Compare hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).send("Invalid email/password");

  // 3. Set secure cookie (stores session ID, NOT password)
  res.cookie("session", "encryptedSessionId123", {
    httpOnly: true, // Blocks JavaScript access
    secure: true,   // HTTPS only
    sameSite: "strict", // Prevents CSRF
    maxAge: 86400000 // 1 day expiry
  });

  res.send("Login successful!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
