const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chapter = require('../models/Chapter');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define an array of models to try, from best to fallback
const modelsToTry = [
  'gemini-2.0-flash-exp',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.0-pro' 
];

// Translate a chapter
router.post('/chapter/:chapterId', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId).populate('novelId', 'originalLanguage');

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    // Check if already translated
    if (chapter.isTranslated && chapter.translatedContent) {
      return res.json({
        message: 'Chapter already translated',
        translatedContent: chapter.translatedContent,
      });
    }

    // Create enhanced translation prompt based on language
    const languageMap = {
      chinese: 'Chinese',
      japanese: 'Japanese',
      korean: 'Korean',
    };

    const sourceLanguage = languageMap[chapter.novelId.originalLanguage] || 'Chinese';

    const prompt = `You are a professional literary translator specializing in ${sourceLanguage} to English translation. 
    
    Please translate the following ${sourceLanguage} novel chapter to English with these guidelines:
    
    1. LITERARY QUALITY: Maintain the original literary style, tone, and narrative voice
    2. CULTURAL CONTEXT: Preserve cultural nuances while making them accessible to English readers
    3. CHARACTER NAMES: Keep original character names but ensure consistency throughout
    4. TERMINOLOGY: Use appropriate English equivalents for titles, places, and cultural concepts
    5. FLOW: Ensure natural English reading flow while preserving the original meaning
    6. FORMATTING: Maintain paragraph breaks and dialogue structure
    7. COMPLETENESS: Translate the entire text without summarization or omission
    
    Chapter Title: ${chapter.title}
    
    Text to translate:
    ${chapter.originalContent}
    
    Please provide a complete, high-quality English translation:`;

    let translatedText;
    let modelUsed;

    // Iterate through models and try to get a successful translation
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.3,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192,
          },
        });
        const result = await model.generateContent(prompt);
        translatedText = result.response.text();
        modelUsed = modelName;
        console.log(`Successfully translated using ${modelUsed}`);
        break; // Exit the loop on success
      } catch (error) {
        console.error(`Failed to use ${modelName}:`, error.message);
        // Continue to the next model in the list
      }
    }

    if (!translatedText) {
      return res.status(500).json({ error: 'All translation models failed to produce a result.' });
    }

    // Update chapter with translation
    chapter.translatedContent = translatedText;
    chapter.isTranslated = true;
    chapter.translationDate = new Date();
    await chapter.save();

    res.json({
      message: `Chapter translated successfully using ${modelUsed}`,
      translatedContent: translatedText,
      modelUsed: modelUsed,
    });
  } catch (error) {
    console.error('Error translating chapter:', error);
    res.status(500).json({ error: 'Failed to translate chapter' });
  }
});

// Get translation status for multiple chapters
router.get('/status/novel/:novelId', async (req, res) => {
  try {
    const chapters = await Chapter.find({ novelId: req.params.novelId })
      .select('chapterNumber isTranslated translationDate')
      .sort({ chapterNumber: 1 });

    const translationStatus = chapters.map((chapter) => ({
      chapterNumber: chapter.chapterNumber,
      isTranslated: chapter.isTranslated,
      translationDate: chapter.translationDate,
    }));

    res.json(translationStatus);
  } catch (error) {
    console.error('Error fetching translation status:', error);
    res.status(500).json({ error: 'Failed to fetch translation status' });
  }
});

module.exports = router;