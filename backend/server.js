const Post = require("./models/Post");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= MONGODB CONNECTION ================= */
mongoose
  .connect("mongodb+srv://Vaarsh:vaarsh123@vaarshhh.8rrxiqn.mongodb.net/vibeloop")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ================= USER SCHEMA ================= */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", UserSchema);

/* ================= POST SCHEMA ================= */
const PostSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  caption: {
    type: String
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= CREATE POST ================= */
app.post("/create-post", async (req, res) => {
  try {
    const { username, caption, image } = req.body;

    const newPost = new Post({
      username,
      caption,
      image
    });

    await newPost.save();

    res.json({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/addPost", async (req, res) => {
    try {
        const { username, content, image } = req.body;

        const newPost = new Post({
            username,
            content,
            image
        });

        await newPost.save();
        res.json({ message: "Post added successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* ================= GET POSTS BY USER ================= */
app.get("/posts/:username", async (req, res) => {
  try {
    const posts = await Post.find({
      username: req.params.username
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= SERVE FRONTEND ================= */
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

/* ================= START SERVER ================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
