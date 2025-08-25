# Novel Translator

A full-stack web application for translating Chinese, Japanese, and Korean novels from EPUB files using Google Gemini AI. The application allows users to upload EPUB files, parse chapters, and translate them on-demand while reading.

## Features

- **EPUB Upload & Parsing**: Upload Chinese, Japanese, or Korean novels in EPUB format
- **AI-Powered Translation**: Uses Google Gemini API for high-quality translations
- **Chapter-by-Chapter Reading**: Read one chapter at a time with easy navigation
- **On-Demand Translation**: Chapters are translated only when you want to read them
- **Dual View**: Switch between original and translated text instantly
- **Smart Caching**: Translations are saved in MongoDB to avoid re-translation
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Vite + React**: Modern frontend build tool with React framework
- **React Router**: Client-side routing for navigation
- **Axios**: HTTP client for API requests
- **Lucide React**: Beautiful icons for the UI

### Backend
- **Node.js + Express**: Server-side runtime and web framework
- **MongoDB + Mongoose**: Database and ODM for data persistence
- **Google Gemini AI**: Advanced AI model for translation
- **Multer**: File upload handling
- **EPUB Parser**: Extract chapters from EPUB files

## Project Structure

```
TranslatorGeminiNovel/
├── frontend/                 # Vite React application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main application component
│   │   └── main.js         # Application entry point
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js Express server
│   ├── models/             # MongoDB data models
│   ├── routes/             # API route handlers
│   ├── index.js            # Server entry point
│   ├── .env.example        # Environment variables template
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Gemini API key

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd TranslatorGeminiNovel
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Add your MongoDB URI and Google Gemini API key
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/novel-translator

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 5. Running the Application

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Novels
- `GET /api/novels` - Get all novels
- `GET /api/novels/:id` - Get a specific novel
- `POST /api/novels/upload` - Upload and parse EPUB file
- `DELETE /api/novels/:id` - Delete a novel and its chapters

### Chapters
- `GET /api/chapters/novel/:novelId` - Get all chapters for a novel
- `GET /api/chapters/:id` - Get a specific chapter
- `GET /api/chapters/novel/:novelId/chapter/:chapterNumber` - Get chapter by number

### Translations
- `POST /api/translations/chapter/:chapterId` - Translate a chapter
- `GET /api/translations/status/novel/:novelId` - Get translation status for all chapters

## Usage

1. **Upload a Novel**: Go to the Upload page and select an EPUB file containing your Chinese, Japanese, or Korean novel.

2. **Browse Novels**: View all your uploaded novels on the My Novels page.

3. **Read and Translate**: Click on a novel to start reading. Navigate through chapters using the sidebar.

4. **Translation**: Click the "Translate" button to translate a chapter. Once translated, you can switch between original and translated text.

5. **Navigation**: Use the chapter list to jump to any chapter, or use the Previous/Next buttons to navigate sequentially.

## Supported Languages

- **Chinese**: Traditional and Simplified Chinese
- **Japanese**: Hiragana, Katakana, and Kanji
- **Korean**: Hangul script

## File Requirements

- **Format**: EPUB (.epub files only)
- **Size**: Maximum 50MB per file
- **Content**: Properly formatted chapters with text content
- **Languages**: Chinese, Japanese, or Korean text

## Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
cd frontend
npm run dev  # Vite development server with hot reload
```

### Building for Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct.

2. **Gemini API Error**: Verify your API key is valid and has sufficient quota.

3. **EPUB Parsing Error**: Ensure the EPUB file is not corrupted and contains readable text content.

4. **Translation Failed**: Check your internet connection and Gemini API quota.

### Getting Help

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the MongoDB connection and Gemini API status

## Future Enhancements

- [ ] Support for additional languages
- [ ] Batch translation of chapters
- [ ] Reading progress tracking
- [ ] User authentication and accounts
- [ ] Bookmarks and favorites
- [ ] Export translated novels
- [ ] Custom translation prompts
- [ ] Dark mode theme
