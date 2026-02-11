# 🥗 MealSnap - AI Food Nutrition Analyzer

MealSnap is a smart web application that uses Google's advanced **Gemini AI** to analyze food images and provide instant nutritional breakdowns. Simply snap a photo or upload an image to get protein, carbs, fats, and calorie counts in seconds.

Deployed at: https://mealsnap.onrender.com/

## ✨ Features

- **AI-Powered Analysis**: Uses Google's Gemini models (via `@google/genai` SDK) to recognize food items.
- **Detailed Nutrition**: Provides weight estimation, macronutrients (Protein, Carbs, Fats), and Calories.
- **Instant Feedack**: Fast processing with the `gemini-2.0-flash` model.
- **Modern UI**: Clean, responsive interface built with React and Vite.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS Modules
- **Backend**: Node.js, Express.js, Multer (File Uploads)
- **AI Engine**: Google Gemini API (`@google/genai`)

## 📂 Project Structure

```bash
MealSnap/
├── src/                # Frontend React Application
│   ├── App.jsx         # Main UI Logic
│   ├── components/     # Reusable Components (CameraInput, etc.)
│   └── index.css       # Global Styles
├── backend/            # Express Backend Server
│   ├── server.js       # API Endpoints & AI Integration
│   ├── uploads/        # Temp storage for image analysis
│   └── .env            # API Keys & Config
└── public/             # Static Assets
```

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
- **Node.js** (v14 or higher) installed on your machine.

### 2. Installation

 Clone the repository (or navigate to the folder) and install dependencies for both frontend and backend.

**Install Dependencies (Root):**
```bash
npm install
```

### 3. 🔑 **IMPORTANT: API Key Setup**

To use the AI features, you need your own Google Gemini API Key.

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Click **"Get API key"** and create a key for a new or existing project.
3.  Copy the API Key string.
4.  In the `backend/` folder, create a file named `.env` (if it doesn't exist).
5.  Add your key to the file like this:

    ```env
    API_KEY=AIzaSy...PasteYourKeyHere...
    PORT=5000
    ```
    *(Replace `AIzaSy...` with your actual copied key)*

### 4. Running the App

You need to run the backend and frontend in separate terminals.

**Terminal 1 (Backend):**
```bash
npm run start:backend
```
*You should see: `Server running on port 5000`*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*Open your browser at the URL shown (usually `http://localhost:5173`)*

---

## 🧪 Testing

We have included a test script to verify the backend without the frontend.
```bash
cd backend
node test_upload.js
```

## 📝 License
This project is for educational purposes.

