import React, { useState } from 'react';
import axios from 'axios';
import { Upload as UploadIcon, File, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production' 
    ? 'https://your-render-app.onrender.com/api' 
    : 'http://localhost:10000/api'
);

const Upload = () => {
  const [file, setFile] = useState(null);
  const [originalLanguage, setOriginalLanguage] = useState('chinese');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.name.toLowerCase().endsWith('.epub')) {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Please select a valid EPUB file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please select an EPUB file.');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('epub', file);
    formData.append('originalLanguage', originalLanguage);
    formData.append('author', author);
    formData.append('description', description);

    try {
      const response = await axios.post(`${API_URL}/novels/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`Success! Novel uploaded with ${response.data.chaptersCount} chapters.`);
      setFile(null);
      setAuthor('');
      setDescription('');
      
      // Reset form
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.response?.data?.error || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Upload EPUB Novel</h1>
          <p>Upload your Chinese, Japanese, or Korean novel in EPUB format for translation.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="card-content">
          {/* File Upload Area */}
          <div className="form-group">
            <label className="form-label">EPUB File *</label>
            <div 
              className={`upload-area ${dragOver ? 'dragover' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <UploadIcon size={48} color="#95a5a6" />
              <p style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.1rem' }}>
                {file ? (
                  <span style={{ color: '#27ae60' }}>
                    <File size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    {file.name}
                  </span>
                ) : (
                  'Drag and drop your EPUB file here, or click to browse'
                )}
              </p>
              <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>
                Supports EPUB files up to 50MB
              </p>
              <input
                id="file-input"
                type="file"
                accept=".epub"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Language Selection */}
          <div className="form-group">
            <label htmlFor="language" className="form-label">Original Language *</label>
            <select
              id="language"
              className="form-control"
              value={originalLanguage}
              onChange={(e) => setOriginalLanguage(e.target.value)}
              required
            >
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
              <option value="korean">Korean</option>
            </select>
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="author" className="form-label">Author (Optional)</label>
            <input
              type="text"
              id="author"
              className="form-control"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description (Optional)</label>
            <textarea
              id="description"
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of the novel"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading || !file}
            style={{ marginTop: '1rem' }}
          >
            {uploading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', marginRight: '0.5rem' }}></div>
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon size={20} style={{ marginRight: '0.5rem' }} />
                Upload Novel
              </>
            )}
          </button>

          {/* Message Display */}
          {message && (
            <div 
              style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                borderRadius: '4px',
                backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
                color: message.includes('Success') ? '#155724' : '#721c24',
                border: `1px solid ${message.includes('Success') ? '#c3e6cb' : '#f5c6cb'}`,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {!message.includes('Success') && <AlertCircle size={20} style={{ marginRight: '0.5rem' }} />}
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Instructions */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Upload Instructions</h2>
        </div>
        <div className="card-content">
          <ol style={{ lineHeight: '1.8' }}>
            <li>Select your EPUB file by dragging and dropping or clicking the upload area</li>
            <li>Choose the original language of your novel (Chinese, Japanese, or Korean)</li>
            <li>Optionally, provide author and description information</li>
            <li>Click "Upload Novel" to process your file</li>
            <li>Once uploaded, the system will parse all chapters and make them available for reading</li>
            <li>Translations will be generated on-demand when you read each chapter</li>
          </ol>
          
          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>File Requirements:</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li>File format: EPUB (.epub)</li>
            <li>Maximum file size: 50MB</li>
            <li>Supported languages: Chinese, Japanese, Korean</li>
            <li>The EPUB should contain properly formatted chapters</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Upload;
