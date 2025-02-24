
## Setup Instructions

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file by copying the example file:
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your Facebook credentials and desired server port.
4. Start the backend server:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3000` by default.

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file by copying the example file:
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with the backend API URL (e.g., `http://localhost:3000`).
4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at the URL provided by Vite (e.g., `http://localhost:5173`).

## Project Overview
This project consists of a backend server for scraping Facebook group posts using Puppeteer and a frontend React application for displaying the scraped posts.