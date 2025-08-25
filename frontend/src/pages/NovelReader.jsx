import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  ArrowRight, 
  Languages, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  Book
} from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

const NovelReader = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentChapterNumber, setCurrentChapterNumber] = useState(1);
  const [showTranslated, setShowTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchNovelAndChapters();
  }, [novelId]);

  useEffect(() => {
    if (chapters.length > 0) {
      loadChapter(currentChapterNumber);
    }
  }, [currentChapterNumber, chapters]);

  const fetchNovelAndChapters = async () => {
    try {
      // Fetch novel details
      const novelResponse = await axios.get(`${API_URL}/novels/${novelId}`);
      setNovel(novelResponse.data);

      // Fetch chapters list
      const chaptersResponse = await axios.get(`${API_URL}/chapters/novel/${novelId}`);
      setChapters(chaptersResponse.data);
      
      if (chaptersResponse.data.length > 0) {
        setCurrentChapterNumber(1);
      }
    } catch (error) {
      console.error('Error fetching novel data:', error);
      setMessage('Failed to load novel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadChapter = async (chapterNumber) => {
    try {
      const response = await axios.get(`${API_URL}/chapters/novel/${novelId}/chapter/${chapterNumber}`);
      setCurrentChapter(response.data);
      setShowTranslated(response.data.isTranslated);
    } catch (error) {
      console.error('Error loading chapter:', error);
      setMessage('Failed to load chapter. Please try again.');
    }
  };

  const translateChapter = async () => {
    if (!currentChapter || currentChapter.isTranslated) return;

    setTranslating(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/translations/chapter/${currentChapter._id}`);
      
      // Update current chapter with translation
      setCurrentChapter(prev => ({
        ...prev,
        translatedContent: response.data.translatedContent,
        isTranslated: true
      }));

      // Update chapters list
      setChapters(prev => prev.map(ch => 
        ch._id === currentChapter._id 
          ? { ...ch, isTranslated: true }
          : ch
      ));

      setShowTranslated(true);
      setMessage('Chapter translated successfully!');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error translating chapter:', error);
      setMessage('Failed to translate chapter. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  const goToChapter = (chapterNumber) => {
    setCurrentChapterNumber(chapterNumber);
  };

  const goToPreviousChapter = () => {
    if (currentChapterNumber > 1) {
      setCurrentChapterNumber(currentChapterNumber - 1);
    }
  };

  const goToNextChapter = () => {
    if (currentChapterNumber < chapters.length) {
      setCurrentChapterNumber(currentChapterNumber + 1);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!novel || !currentChapter) {
    return (
      <div className="card">
        <div className="card-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>Novel or chapter not found</h3>
          <button onClick={() => navigate('/novels')} className="btn btn-primary">
            Back to Novels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-container">
      {/* Chapter Sidebar */}
      <div className="chapter-sidebar">
        <div style={{ marginBottom: '1rem' }}>
          <button 
            onClick={() => navigate('/novels')} 
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}
          >
            <ArrowLeft size={18} />
            Back to Novels
          </button>
        </div>

        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#2c3e50' }}>
          {novel.title}
        </h3>

        <div className="chapter-list">
          {chapters.map((chapter) => (
            <div
              key={chapter._id}
              className={`chapter-item ${chapter.chapterNumber === currentChapterNumber ? 'active' : ''}`}
              onClick={() => goToChapter(chapter.chapterNumber)}
            >
              <div>
                <div style={{ fontWeight: chapter.chapterNumber === currentChapterNumber ? 'bold' : 'normal' }}>
                  Chapter {chapter.chapterNumber}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                  {chapter.title}
                </div>
              </div>
              <div className={`chapter-status ${chapter.isTranslated ? 'translated' : 'original'}`}>
                {chapter.isTranslated ? 'Translated' : 'Original'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapter Content */}
      <div className="chapter-content">
        {/* Chapter Controls */}
        <div className="chapter-controls">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <button
              onClick={goToPreviousChapter}
              disabled={currentChapterNumber === 1}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => setShowTranslated(false)}
                className={`btn ${!showTranslated ? 'btn-primary' : 'btn-secondary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <FileText size={18} />
                Original
              </button>

              {currentChapter.isTranslated ? (
                <button
                  onClick={() => setShowTranslated(true)}
                  className={`btn ${showTranslated ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Languages size={18} />
                  Translated
                </button>
              ) : (
                <button
                  onClick={translateChapter}
                  disabled={translating}
                  className="btn btn-success"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {translating ? (
                    <>
                      <div className="spinner" style={{ width: '18px', height: '18px' }}></div>
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages size={18} />
                      Translate
                    </>
                  )}
                </button>
              )}
            </div>

            <button
              onClick={goToNextChapter}
              disabled={currentChapterNumber === chapters.length}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div 
            style={{ 
              marginBottom: '1rem', 
              padding: '1rem', 
              borderRadius: '4px',
              backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
              color: message.includes('success') ? '#155724' : '#721c24',
              border: `1px solid ${message.includes('success') ? '#c3e6cb' : '#f5c6cb'}`
            }}
          >
            {message}
          </div>
        )}

        {/* Chapter Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
            Chapter {currentChapter.chapterNumber}: {currentChapter.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Book size={16} />
              <span>{currentChapter.wordCount} characters</span>
            </div>
            <div>
              {showTranslated ? 'English Translation' : `Original ${novel.originalLanguage}`}
            </div>
          </div>
        </div>

        {/* Chapter Text */}
        <div className="chapter-text">
          {showTranslated && currentChapter.isTranslated ? (
            currentChapter.translatedContent
          ) : (
            currentChapter.originalContent
          )}
        </div>

        {/* Navigation Footer */}
        <div style={{ 
          marginTop: '3rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #eee',
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={goToPreviousChapter}
            disabled={currentChapterNumber === 1}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ChevronLeft size={18} />
            Previous Chapter
          </button>

          <span style={{ color: '#7f8c8d' }}>
            Chapter {currentChapterNumber} of {chapters.length}
          </span>

          <button
            onClick={goToNextChapter}
            disabled={currentChapterNumber === chapters.length}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Next Chapter
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NovelReader;
