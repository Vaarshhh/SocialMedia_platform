const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: String,
  caption: String,
  imageUrl: String,
  likes: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", PostSchema);
