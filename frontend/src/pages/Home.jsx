import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, Languages } from 'lucide-react';

const Home = () => {
  return (
    <div className="home">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Welcome to Novel Translator</h1>
        </div>
        <div className="card-content">
          <p>
            Transform your reading experience by translating Chinese, Japanese, and Korean novels 
            into English using advanced AI technology. Upload EPUB files and enjoy seamless 
            chapter-by-chapter translation.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={24} color="#3498db" />
              <h3 className="card-title">Upload EPUB</h3>
            </div>
          </div>
          <div className="card-content">
            <p>Upload your Chinese, Japanese, or Korean novel in EPUB format. Our system will automatically parse chapters and prepare them for translation.</p>
            <Link to="/upload" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Get Started
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Languages size={24} color="#27ae60" />
              <h3 className="card-title">AI Translation</h3>
            </div>
          </div>
          <div className="card-content">
            <p>Powered by Google Gemini AI, get high-quality translations that preserve the literary style and cultural context of your novels.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={24} color="#e74c3c" />
              <h3 className="card-title">Chapter Reading</h3>
            </div>
          </div>
          <div className="card-content">
            <p>Read one chapter at a time with easy navigation. Switch between original and translated text, and translations are saved for future reading.</p>
            <Link to="/novels" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              Browse Novels
            </Link>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Features</h2>
        </div>
        <div className="card-content">
          <ul style={{ lineHeight: '1.8' }}>
            <li><strong>On-demand Translation:</strong> Chapters are translated only when you want to read them</li>
            <li><strong>Multiple Languages:</strong> Support for Chinese, Japanese, and Korean novels</li>
            <li><strong>Smart Caching:</strong> Translations are saved to avoid re-translation</li>
            <li><strong>Easy Navigation:</strong> Jump to any chapter with a simple chapter list</li>
            <li><strong>Dual View:</strong> Switch between original and translated text instantly</li>
            <li><strong>Cloud Storage:</strong> Your novels and translations are safely stored in the cloud</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
