# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a full-stack novel translation application with the following architecture:

## Project Structure
- `frontend/` - Vite React application for the user interface
- `backend/` - Node.js Express server with MongoDB integration

## Key Features
- EPUB file upload and parsing
- Chapter-by-chapter translation using Google Gemini API
- MongoDB storage for novels, chapters, and translations
- On-demand translation (only when user wants to read a chapter)
- Chapter navigation and reading interface
- Toggle between original and translated text

## Technologies Used
- **Frontend**: Vite + React + JavaScript
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Translation**: Google Gemini API
- **File Processing**: EPUB parser for extracting chapters
- **Database**: MongoDB for storing novels, chapters, and translations

## Development Guidelines
- Use async/await for asynchronous operations
- Implement proper error handling for API calls
- Use environment variables for sensitive configuration
- Follow REST API conventions for backend endpoints
- Implement responsive design for the frontend
- Cache translations in MongoDB to avoid re-translation
- Support Chinese, Japanese, and Korean text processing
