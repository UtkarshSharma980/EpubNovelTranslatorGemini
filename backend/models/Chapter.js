const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  novelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true
  },
  chapterNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalContent: {
    type: String,
    required: true
  },
  translatedContent: {
    type: String,
    default: null
  },
  isTranslated: {
    type: Boolean,
    default: false
  },
  translationDate: {
    type: Date,
    default: null
  },
  wordCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure unique chapter numbers per novel
chapterSchema.index({ novelId: 1, chapterNumber: 1 }, { unique: true });

module.exports = mongoose.model('Chapter', chapterSchema);
