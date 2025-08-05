#!/bin/bash

# ---
# This script creates the necessary file structure for the CV Chatbot project.
# It assumes it is being run from the project's root directory.
# ---

echo "🚀 Starting CV Chatbot file setup..."

# Create directories (the -p flag prevents errors if they already exist)
mkdir -p src/components
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p src/data
mkdir -p src/styles

# Create Component files
echo "  -> Creating component files..."
touch src/components/ChatInterface.jsx
touch src/components/ResumeTemplate.jsx

# Create Utility files
echo "  -> Creating utility files..."
touch src/utils/openaiService.js
touch src/utils/resumeValidator.js
touch src/utils/pdfUtils.js

# Create Hook files
echo "  -> Creating hook files..."
touch src/hooks/useChat.js
touch src/hooks/useResumeData.js

# Create Data file
echo "  -> Creating data file..."
touch src/data/resumeData.json

# Create Style files
echo "  -> Creating style files..."
touch src/styles/Chat.css
touch src/styles/Resume.css
# Note: The Vite template might have put App.css in src/. 
# We are creating a new one in src/styles/ for better organization.
touch src/styles/App.css 

# Create root-level configuration and documentation files
echo "  -> Creating root-level files..."
touch .env
touch .env.example
touch README.md

echo "✅ File structure created successfully!"
echo ""
echo "Next Steps:"
echo "1. Paste the provided code into each new file."
echo "2. Add your 'VITE_OPENAI_API_KEY=your_key_here' to the .env file."
echo "3. Remember to update your imports in App.jsx to point to the new file locations (e.g., './styles/App.css')."