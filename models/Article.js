const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  url: String,
  image: String,
  author: String,
  date: String,
  tags: [String],
  excerpt: String,
  scrapedAt: String
}, { timestamps: true });

// Export the MODEL (not the schema)
module.exports = mongoose.model('Article', articleSchema);
