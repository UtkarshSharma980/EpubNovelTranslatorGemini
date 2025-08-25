import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Calendar, User, Trash2, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production' 
    ? 'https://novel-translator-backend.onrender.com/api' 
    : 'http://localhost:10000/api'
);

// Debug logging
console.log('🔧 Debug Info:');
console.log('Mode:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final API_URL:', API_URL);

const NovelList = () => {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchNovels();
  }, []);

  const fetchNovels = async () => {
    try {
      const response = await axios.get(`${API_URL}/novels`);
      setNovels(response.data);
    } catch (error) {
      console.error('Error fetching novels:', error);
      setMessage('Failed to load novels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteNovel = async (novelId, novelTitle) => {
    if (window.confirm(`Are you sure you want to delete "${novelTitle}" and all its chapters?`)) {
      try {
        await axios.delete(`${API_URL}/novels/${novelId}`);
        setNovels(novels.filter(novel => novel._id !== novelId));
        setMessage('Novel deleted successfully.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting novel:', error);
        setMessage('Failed to delete novel. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageFlag = (language) => {
    const flags = {
      chinese: '🇨🇳',
      japanese: '🇯🇵',
      korean: '🇰🇷'
    };
    return flags[language] || '📖';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="novel-list">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">My Novels</h1>
          <p>Manage your uploaded novels and continue reading where you left off.</p>
        </div>
      </div>

      {message && (
        <div 
          style={{ 
            margin: '1rem 0', 
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

      {novels.length === 0 ? (
        <div className="card">
          <div className="card-content" style={{ textAlign: 'center', padding: '3rem' }}>
            <BookOpen size={64} color="#95a5a6" style={{ marginBottom: '1rem' }} />
            <h3>No novels uploaded yet</h3>
            <p style={{ marginBottom: '2rem', color: '#7f8c8d' }}>
              Start by uploading your first EPUB novel to begin your translation journey.
            </p>
            <Link to="/upload" className="btn btn-primary">
              Upload Your First Novel
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {novels.map((novel) => (
            <div key={novel._id} className="card">
              <div className="card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 className="card-title" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{getLanguageFlag(novel.originalLanguage)}</span>
                      {novel.title}
                    </h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
                      {novel.author && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <User size={16} />
                          <span>{novel.author}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={16} />
                        <span>Uploaded {formatDate(novel.uploadDate)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <BookOpen size={16} />
                        <span>{novel.totalChapters} chapters</span>
                      </div>
                    </div>

                    {novel.description && (
                      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                        {novel.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: '#e3f2fd', 
                        color: '#1976d2', 
                        borderRadius: '12px',
                        textTransform: 'capitalize'
                      }}>
                        {novel.originalLanguage}
                      </span>
                      <span style={{ color: '#7f8c8d' }}>
                        {novel.fileName}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <Link 
                      to={`/novel/${novel._id}`} 
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Eye size={18} />
                      Read
                    </Link>
                    <button
                      onClick={() => deleteNovel(novel._id, novel.title)}
                      className="btn btn-danger"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {novels.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/upload" className="btn btn-secondary">
            Upload Another Novel
          </Link>
        </div>
      )}
    </div>
  );
};

export default NovelList;
