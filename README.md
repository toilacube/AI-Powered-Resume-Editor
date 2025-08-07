# AI CV/Resume Chatbot

A web-based application that allows users to create, edit, and enhance their resume through a conversational AI chatbot. The project features a modern React frontend and a secure Node.js backend to handle communication with the OpenAI API.

## ✨ Key Features

-   🤖 **Conversational Editing**: Update your resume by simply talking to the chatbot (e.g., "Add a new skill: 'GraphQL'").
-   📄 **Real-Time Preview**: Instantly see changes to your CV reflected in a clean, professional template.
-   ⚡️ **Optimized for Speed**: Uses **JSON Patch** to send only the data changes, not the entire CV object, minimizing latency and response size.
-   🔒 **Secure API Handling**: All communication with the OpenAI API is proxied through a secure backend server, ensuring your API key is never exposed in the browser.
-   💾 **Local Persistence**: Your resume data is automatically saved to your browser's `localStorage`, so your work is preserved between sessions.
-   📝 **Job Description Analysis**: Paste a job description into the chat to get an analysis of how your CV matches and where you can improve.
-   ⬇️ **PDF Generation**: Download your final resume as a high-quality PDF document with a single click.

---

## 🏗️ Architecture

This project uses a secure client-server architecture:

-   **Frontend (Client)**: A React application built with Vite that serves the user interface. It runs on `http://localhost:5173`.
-   **Backend (Server)**: A lightweight Node.js/Express server that acts as a secure proxy. It is the only part of the system that communicates with the OpenAI API. It runs on `http://localhost:3001`.

**Request Flow:**
`Browser (React UI) ↔️ Backend (Node.js/Express) ↔️ OpenAI API`

---

## 🛠️ Technology Stack

| Component | Technology                                                              |
| :-------- | :---------------------------------------------------------------------- |
| **Frontend**  | React, Vite, Lucide-React (icons), `fast-json-patch`, `jspdf`, `html2canvas` |
| **Backend**   | Node.js, Express, `openai` (official SDK), `dotenv`, `cors`             |
| **Language**  | JavaScript (ES Modules)                                                 |
| **Package Manager** | `pnpm`                                                          |

---

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [pnpm](https://pnpm.io/installation) package manager (`npm install -g pnpm`)
-   An Gemini API key. Access aistudio.google.com to get it.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cv-chatbot.git
cd cv-chatbot
```

### 2. Set Up the Backend Server

The backend is responsible for securely handling your API key.

```bash
# Navigate to the server directory
cd server

# Install backend dependencies
pnpm install
```

Next, create a `.env` file inside the `server/` directory and add your OpenAI API key:

**File: `server/.env`**
```
OPENAI_API_KEY=sk-your-secret-openai-api-key-here
```

### 3. Set Up the Frontend Application

The frontend contains all the UI components. Open a new terminal for this step.

```bash
# Navigate to the project's root directory (if you are in the server directory, use 'cd ..')
cd .. 

# Install frontend dependencies
pnpm install
```

---

## ▶️ Running the Application

You need to run both the backend and frontend servers simultaneously in **two separate terminals**.

**Terminal 1: Start the Backend**

```bash
# In the `server` directory
cd server
pnpm dev```
✅ Your backend server should now be running at `http://localhost:3001`.

**Terminal 2: Start the Frontend**

```bash
# In the project's root `cv-chatbot` directory
pnpm dev
```
✅ Your React application should now be running and will open automatically at `http://localhost:5173`.

---

## 💬 How to Use

Once the application is running, you can interact with the chatbot using natural language. Here are some examples:

-   `Change my name to Jane Doe.`
-   `Add a new skill: "Teamwork"`
-   `Update my experience at LOTTE INNOVATE, change the role to "Senior FullStack Developer"`
-   `Add a new responsibility to my project "Job Search Platform": "Implemented a real-time notification system using WebSockets"`
-   `(Paste a full job description)` - The AI will provide an analysis.

---

## 📂 Project Structure

```
cv-chatbot/
├── server/               # Backend Node.js/Express application
│   ├── .env              # Securely stores the API key (must be created)
│   ├── server.js         # The Express server logic
│   └── package.json      # Backend dependencies
│
├── src/                  # Frontend React application
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks (useChat, useResumeData)
│   ├── utils/            # Utility functions (API service, PDF generation)
│   ├── data/             # Initial resume data
│   ├── styles/           # CSS stylesheets
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
│
├── .gitignore
├── package.json          # Frontend dependencies
└── README.md             # This file
```

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.