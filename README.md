# AI-Powered Resume Editor

This project is a web-based resume editing application that leverages the power of Google's Gemini AI to help users update and refine their resume through a conversational chat interface. Users can describe the changes they want in plain English, and the AI will intelligently modify the resume data, which is then reflected in a live preview.

## Key Features

-   **Conversational Editing**: Update your resume by simply chatting with an AI assistant. Tell it to add a skill, change a job title, or describe a new project.
-   **Live Resume Preview**: See your changes reflected instantly in a clean, professionally formatted resume template.
-   **PDF Parsing**: Upload your existing resume in PDF format. The application will use AI to parse the document and automatically populate the data structure.
-   **Download as PDF**: Export your finished resume as a high-quality PDF document, ready to be sent to recruiters.
-   **Version History**: The application keeps a history of all changes made. You can view past versions and revert to any point in time.
-   **Secure API Key Handling**: Your Gemini API key is stored securely in your browser's local storage and is never exposed to the outside world.
-   **Model Selection**: Choose between different Gemini models to balance speed and capability based on your needs.

## How It Works

The application maintains the resume's content as a structured JSON object. When a user sends a message, the following process occurs:

1.  **User Input**: The user's request, along with the current JSON resume data, is sent to the Gemini API.
2.  **AI Processing**: A carefully crafted system prompt instructs the AI to act as a "JSON transformation engine". It analyzes the request and generates a [JSON Patch (RFC 6902)](https://tools.ietf.org/html/rfc6902) array.
3.  **Applying Patches**: The returned JSON Patch is applied to the current resume data using the `fast-json-patch` library.
4.  **State Update**: The new resume data is saved, creating a new entry in the version history.
5.  **UI Re-render**: The React UI updates instantly to reflect the new data in the resume preview.

## Tech Stack

-   **Frontend**: React, Vite
-   **AI**: Google Gemini API (`@google/genai`)
-   **PDF Generation**: `@react-pdf/renderer`
-   **UI Components**:
    -   Icons: `lucide-react`
-   **Core Logic**:
    -   JSON Patching: `fast-json-patch`
-   **Styling**: Plain CSS

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

-   Node.js (v18 or later)
-   pnpm (or you can adapt the commands for npm/yarn)
-   A Google Gemini API Key. You can get one for free from [Google AI Studio](https://ai.google.dev/gemini-api/docs/quickstart).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    cd resume
    ```

2.  **Install dependencies:**
    ```sh
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```sh
    cp .env.example .env
    ```
    *Note: This project doesn't require any server-side environment variables as the API key is handled on the client-side. The `.env` file is included for potential future use.*

4.  **Run the development server:**
    ```sh
    pnpm dev
    ```

The application should now be running on `http://localhost:5173` (or another port if 5173 is in use). Open the URL in your browser, enter your Gemini API key in the settings panel, and start editing!

## Project Structure

```
src/
|-- assets/         # Static assets like images and SVGs
|-- components/     # Reusable React components
|-- data/           # Initial resume data and JSON schema
|-- hooks/          # Custom React hooks for managing state and logic
|-- styles/         # Global and component-specific CSS files
|-- utils/          # Utility functions (API services, validators)
|-- App.jsx         # Main application component
|-- main.jsx        # Application entry point
```


### TODO List & Future Enhancements

Here is a list of potential features and improvements to enhance the application.

#### ⭐ Core Features

-   **[ ] Enhanced AI Analysis**:
    -   Create a new "Analysis" mode for the chat.
    -   Users could paste a job description, and the AI would provide suggestions on how to tailor the resume for that specific role.
    -   Example prompts: "Improve my responsibilities for the FullStack Developer role," or "Does my resume match this job description?"

-   **[ ] Direct Field Editing**:
    -   Allow users to click directly on fields in the resume preview (e.g., a job title or a list item) to edit them in place.
    -   This should trigger the same `updateResumeAndCreateHistory` flow to maintain consistency with chat-based edits.

-   **[ ] Multiple Resume Templates**:
    -   Design 2-3 different resume templates (e.g., modern, classic, compact).
    -   Allow the user to switch between templates and see the preview update instantly.
    -   The selected template should be used for the PDF download.

#### 🎨 UI/UX Improvements

-   **[ ] Improved Error Handling**:
    -   Display more user-friendly error messages (e.g., toasts or inline alerts) when the API key is invalid, the PDF upload fails, or the AI returns an invalid format.

-   **[ ] Loading Skeletons**:
    -   Show skeleton loaders in the resume preview panel while waiting for the initial data to load or while the AI is processing a major update.

-   **[ ] Responsive Design**:
    -   Refine the CSS to ensure the application is fully usable on smaller screens and tablets. The sidebar could become a collapsible drawer on mobile.
