const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');

// Get all chapters for a novel
router.get('/novel/:novelId', async (req, res) => {
  try {
    const chapters = await Chapter.find({ novelId: req.params.novelId })
      .sort({ chapterNumber: 1 })
      .select('chapterNumber title isTranslated wordCount');
    
    res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Get a specific chapter
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id)
      .populate('novelId', 'title originalLanguage');
    
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

// Get chapter by novel ID and chapter number
router.get('/novel/:novelId/chapter/:chapterNumber', async (req, res) => {
  try {
    const chapter = await Chapter.findOne({
      novelId: req.params.novelId,
      chapterNumber: parseInt(req.params.chapterNumber)
    }).populate('novelId', 'title originalLanguage');

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

module.exports = router;
