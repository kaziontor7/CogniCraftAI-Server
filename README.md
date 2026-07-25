# CogniCraft AI - Express API Server

High-performance Express backend server for CogniCraft AI Autonomous Skill Academy & Tech Career Hub. Provides course management REST endpoints, real-time AI streaming integrations, and MongoDB Atlas database connection.

## 🚀 API Architecture

- **Course Operations**: REST endpoints for retrieving, searching, creating, updating, and deleting specialization tracks with pagination and sorting.
- **AI Streaming & Career Studio**: Integrated Server-Sent Events (SSE) word-by-word streaming AI Code Assistant and skill gap analyzer powered by Google Gemini 2.5.
- **Database Layer**: Mongoose ORM models for MongoDB Atlas document storage.
- **JWT & Auth Middleware**: Token validation middleware for protected API routes.

## 🛠️ Tech Stack

- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas with Mongoose ORM
- **AI Integration**: `@google/genai` (Gemini 2.5 Flash)
- **Language**: TypeScript with `ts-node-dev` hot-reloading

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Server
```bash
npm run dev
```

The Express API will be live at `http://localhost:5000`.
