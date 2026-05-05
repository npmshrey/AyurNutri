# AyurNutri 🌿

AyurNutri is a comprehensive Ayurvedic Diet Management Platform designed to bridge the gap between modern clinical nutrition and traditional Ayurvedic principles. 

Currently, many Ayurvedic practitioners rely on inefficient, manual, handwritten diet charts because existing nutrition software only tracks modern macros and micros. AyurNutri digitizes and automates this workflow, empowering doctors and patients with personalized, holistic dietary care.

## 🚀 Key Features

*   **Dual-Metric Tracking:** Uniquely tracks both modern nutrients (calories, proteins, carbs, fats) and ancient Ayurvedic properties (Rasa/taste, Virya/temperature, Guna/qualities, and digestion ease).
*   **AI-Powered Food Scanner:** Upload a photo of a meal, and our Gemini-powered AI will instantly analyze its modern nutritional value and its impact on your Doshas (Vata, Pitta, Kapha).
*   **Automated Diet Charts:** Instantly generates nutritionally balanced, tailored, recipe-based diet plans for patients.
*   **Extensive Database:** Features a dynamic database of 8,000+ diverse, multicultural food items.
*   **Patient Management Dashboard:** Maintains detailed patient profiles including age, habits, bowel movements, and Ayurvedic doshas for practitioners.
*   **Modern & Secure:** Features an intuitive, mobile-friendly UI, printable reports, and a scalable architecture.

## 💻 Tech Stack

### Frontend
*   **React 18** (Vite)
*   **Tailwind CSS** (for styling and responsive design)
*   **Redux Toolkit** (for robust state management)
*   **React Router Dom** (for navigation)
*   **Recharts** (for data visualization)
*   **Socket.io-client** (for real-time communication)

### Backend
*   **Node.js & Express** (Server architecture)
*   **MongoDB & Mongoose** (Database)
*   **Google Gemini Vision API** (`gemini-2.0-flash` for AI Food Scanning)
*   **Socket.io** (WebSockets for real-time syncing)
*   **JWT & bcryptjs** (Authentication & Security)
*   **Nodemailer** (Email communications)

## 🛠️ Hardest Problem Solved

One of the most complex engineering challenges in this project was building the **AI-powered Food Scanner**. 

It required handling asynchronous AI data in React where the backend API (powered by Google Gemini) could return deeply nested or inconsistent JSON structures. To ensure the frontend remained robust, I implemented defensive state management, dynamic data mapping, and robust error handling. This ensured the React UI stayed stable, responsive, and didn’t break on missing or unexpected fields, while the backend utilized a highly restrictive prompt engineering pipeline to strictly format the AI's output.

## ⚙️ How to Run Locally

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance
*   Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Shreyanshu-Gupta/AyurNutri.git
cd AyurNutri
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the backend directory and add your keys (MongoDB URI, JWT Secret, Gemini API Key).
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../Frontend
npm install
npm start
```

The app should now be running locally. Enjoy!
