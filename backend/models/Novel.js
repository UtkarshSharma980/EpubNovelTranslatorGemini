const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalLanguage: {
    type: String,
    required: true,
    enum: ['chinese', 'japanese', 'korean']
  },
  author: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String // URL or base64 string
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  totalChapters: {
    type: Number,
    default: 0
  },
  fileName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Novel', novelSchema);
