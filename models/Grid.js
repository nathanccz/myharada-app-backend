const mongoose = require('mongoose')

const GridSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  gridType: {
    type: String,
    enum: ['ongoing', 'project'],
    required: true,
  },
  grids: {
    type: Array,
    required: true,
  },
  templateCategory: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
})

const Watchlist = mongoose.model('Grid', GridSchema)

module.exports = Watchlist
