const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdmZip = require('adm-zip');
const { parseStringPromise } = require('xml2js');
const Novel = require('../models/Novel');
const Chapter = require('../models/Chapter');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept EPUB files
    if (file.mimetype === 'application/epub+zip' || file.originalname.toLowerCase().endsWith('.epub')) {
      cb(null, true);
    } else {
      cb(new Error('Only EPUB files are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Get all novels
router.get('/', async (req, res) => {
  try {
    const novels = await Novel.find().sort({ uploadDate: -1 });
    res.json(novels);
  } catch (error) {
    console.error('Error fetching novels:', error);
    res.status(500).json({ error: 'Failed to fetch novels' });
  }
});

// Get a specific novel by ID
router.get('/:id', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ error: 'Novel not found' });
    }
    res.json(novel);
  } catch (error) {
    console.error('Error fetching novel:', error);
    res.status(500).json({ error: 'Failed to fetch novel' });
  }
});

// Helper function to parse EPUB file
const parseEpub = async (buffer) => {
  const zip = new AdmZip(buffer);
  const zipEntries = zip.getEntries();
  
  // Find and parse container.xml
  const containerEntry = zipEntries.find(entry => entry.entryName === 'META-INF/container.xml');
  if (!containerEntry) {
    throw new Error('Invalid EPUB: container.xml not found');
  }
  
  const containerXml = containerEntry.getData().toString('utf8');
  const containerData = await parseStringPromise(containerXml);
  
  // Get the path to the OPF file
  const opfPath = containerData.container.rootfiles[0].rootfile[0].$['full-path'];
  
  // Parse the OPF file (contains metadata and spine)
  const opfEntry = zipEntries.find(entry => entry.entryName === opfPath);
  if (!opfEntry) {
    throw new Error('Invalid EPUB: OPF file not found');
  }
  
  const opfXml = opfEntry.getData().toString('utf8');
  const opfData = await parseStringPromise(opfXml);
  
  // Extract metadata
  const metadata = {
    title: opfData.package.metadata[0]['dc:title'] ? opfData.package.metadata[0]['dc:title'][0] : 'Unknown Title',
    creator: opfData.package.metadata[0]['dc:creator'] ? opfData.package.metadata[0]['dc:creator'][0] : 'Unknown Author',
    description: opfData.package.metadata[0]['dc:description'] ? opfData.package.metadata[0]['dc:description'][0] : ''
  };
  
  // Get the directory of the OPF file
  const opfDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);
  
  // Extract spine (reading order)
  const spine = opfData.package.spine[0].itemref || [];
  const manifest = opfData.package.manifest[0].item || [];
  
  // Create a map of manifest items
  const manifestMap = {};
  manifest.forEach(item => {
    manifestMap[item.$.id] = item.$.href;
  });
  
  // Get chapters in reading order
  const chapters = [];
  for (let i = 0; i < spine.length; i++) {
    const spineItem = spine[i];
    const itemId = spineItem.$.idref;
    const href = manifestMap[itemId];
    
    if (href) {
      const fullPath = opfDir + href;
      const chapterEntry = zipEntries.find(entry => entry.entryName === fullPath);
      
      if (chapterEntry) {
        const content = chapterEntry.getData().toString('utf8');
        chapters.push({
          id: itemId,
          href: href,
          content: content,
          index: i
        });
      }
    }
  }
  
  return {
    metadata,
    chapters
  };
};

// Helper function to clean HTML content
const cleanHtmlContent = (html) => {
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<style[^>]*>.*?<\/style>/gi, '') // Remove style tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

// Upload and parse EPUB file
router.post('/upload', upload.single('epub'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No EPUB file provided' });
    }

    const { originalLanguage, author, description } = req.body;

    // Parse EPUB file
    const epubData = await parseEpub(req.file.buffer);
    
    const title = epubData.metadata.title || req.file.originalname.replace('.epub', '');

    // Create novel document
    const novel = new Novel({
      title,
      originalLanguage: originalLanguage || 'chinese',
      author: author || epubData.metadata.creator || 'Unknown',
      description: description || epubData.metadata.description || '',
      fileName: req.file.originalname,
      totalChapters: 0 // Will be updated after parsing chapters
    });

    await novel.save();

    // Extract and save chapters
    const savedChapters = [];
    
    for (let i = 0; i < epubData.chapters.length; i++) {
      const chapterData = epubData.chapters[i];
      
      try {
        // Clean HTML content to get plain text
        const cleanContent = cleanHtmlContent(chapterData.content);
        
        if (cleanContent.length > 100) { // Only save chapters with substantial content
          // Extract title from content or use default
          let chapterTitle = `Chapter ${savedChapters.length + 1}`;
          
          // Try to extract title from first heading or paragraph
          const titleMatch = chapterData.content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i) || 
                           chapterData.content.match(/<title[^>]*>(.*?)<\/title>/i);
          if (titleMatch) {
            chapterTitle = cleanHtmlContent(titleMatch[1]).substring(0, 100);
          }
          
          const chapter = new Chapter({
            novelId: novel._id,
            chapterNumber: savedChapters.length + 1,
            title: chapterTitle,
            originalContent: cleanContent,
            wordCount: cleanContent.length
          });

          await chapter.save();
          savedChapters.push(chapter);
        }
      } catch (chapterError) {
        console.log(`Error parsing chapter ${i + 1}:`, chapterError.message);
        // Continue with next chapter
      }
    }

    // Update novel with actual chapter count
    novel.totalChapters = savedChapters.length;
    await novel.save();

    res.json({
      message: 'EPUB uploaded and parsed successfully',
      novel,
      chaptersCount: savedChapters.length
    });

  } catch (error) {
    console.error('Error uploading EPUB:', error);
    res.status(500).json({ error: 'Failed to upload and parse EPUB file: ' + error.message });
  }
});

// Delete a novel and its chapters
router.delete('/:id', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ error: 'Novel not found' });
    }

    // Delete all chapters for this novel
    await Chapter.deleteMany({ novelId: req.params.id });
    
    // Delete the novel
    await Novel.findByIdAndDelete(req.params.id);

    res.json({ message: 'Novel and its chapters deleted successfully' });
  } catch (error) {
    console.error('Error deleting novel:', error);
    res.status(500).json({ error: 'Failed to delete novel' });
  }
});

module.exports = router;
