require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

// Import models from the models directory
const User = require("./models/User");
const Badge = require("./models/Badge");
const BadgesEarned = require("./models/BadgesEarned");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Get all badges
app.get("/badges", async (req, res) => {
  try {
    const badges = await Badge.find({});
    res.json({ badges });
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get single badge by ID
app.get("/badge/:id", async (req, res) => {
  try {
    const badge = await Badge.findOne({ id: parseInt(req.params.id) });
    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }
    res.json(badge);
  } catch (error) {
    console.error("Error fetching badge:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all users (admin only)
app.get("/users", async (req, res) => {
  try {
    // In a production app, add admin authentication check here
    const users = await User.find({}).select("-password");
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists! Please log in." });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Signup successful!", username: newUser.username });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route (Accepts email or username)
app.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // Fetch earned badges
    const userBadges = await BadgesEarned.findOne({ username: user.username }).lean();
    const allBadges = userBadges
      ? await Badge.find({ id: { $in: userBadges.badges.map(b => b.badgeId) } })
      : [];

    // Map earned badges with dates
    const earnedBadges = allBadges.map(badge => ({
      ...badge.toObject(),
      earnedDate: userBadges?.badges.find(b => b.badgeId === badge.id)?.earnedDate
    }));

    res.json({
      message: "Login Successful!",
      user: {
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin, // Include admin status
        badges: earnedBadges,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get Badges Earned by User
app.get("/badges-earned/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Fetch earned badges
    const userBadges = await BadgesEarned.findOne({ username }).lean();
    
    if (!userBadges) {
      console.log(`No badges found for user: ${username}`);
      return res.json({ badges: [] });
    }

    // Fetch full badge details for each earned badge
    const badgeIds = userBadges.badges.map(b => b.badgeId);
    console.log(`Looking for badge IDs: ${badgeIds.join(', ')}`);
    
    const allBadges = await Badge.find({ id: { $in: badgeIds } }).lean();
    console.log(`Found ${allBadges.length} badges`);

    // If no badges found but user has badge entries, log this discrepancy
    if (allBadges.length === 0 && badgeIds.length > 0) {
      console.log("Warning: User has badge records but no matching badges found");
      console.log("Badge IDs in user record:", badgeIds);
      
      // Check if badges exist at all
      const totalBadges = await Badge.countDocuments();
      console.log(`Total badges in database: ${totalBadges}`);
      
      // Check a sample badge to see its structure
      const sampleBadge = await Badge.findOne();
      console.log("Sample badge structure:", sampleBadge);
    }

    // Map earned badges with dates
    const earnedBadges = allBadges.map(badge => ({
      ...badge,
      earnedDate: userBadges.badges.find(b => b.badgeId === badge.id)?.earnedDate
    }));

    console.log(`Returning ${earnedBadges.length} badges`);
    res.json({ badges: earnedBadges });
  } catch (error) {
    console.error("Error fetching badges:", error);
    // Send better error message
    res.status(500).json({ 
      message: "Error loading badges", 
      error: error.message 
    });
  }
});

// Get user details
app.get("/user/:username", async (req, res) => {
  console.log("Route hit with username:", req.params.username);
  try {
    const { username } = req.params;
    console.log("Looking up user:", username);
    const user = await User.findOne({ username }).select("-password");
    console.log("Query result:", user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Assign badge to user
app.post("/assign-badge", async (req, res) => {
  try {
    const { username, badgeId, adminUsername } = req.body;
    
    // Check if admin user exists and is actually an admin
    const adminUser = await User.findOne({ username: adminUsername });
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Unauthorized. Admin access required." });
    }
    
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if badge exists
    const badge = await Badge.findOne({ id: badgeId });
    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }
    
    // Check if user already has badge record
    let userBadges = await BadgesEarned.findOne({ username });
    
    if (userBadges) {
      // Check if user already has this badge
      const hasBadge = userBadges.badges.some(b => b.badgeId === badgeId);
      
      if (hasBadge) {
        return res.status(400).json({ message: "User already has this badge" });
      }
      
      // Add badge to existing record
      userBadges.badges.push({ badgeId, earnedDate: new Date() });
      await userBadges.save();
    } else {
      // Create new badges earned record
      userBadges = new BadgesEarned({
        username,
        badges: [{ badgeId, earnedDate: new Date() }]
      });
      await userBadges.save();
    }
    
    res.json({ message: "Badge assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add an endpoint to check admin status
app.get("/check-admin", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ isAdmin: false });
    }
    
    res.json({ isAdmin: user.isAdmin || false });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));