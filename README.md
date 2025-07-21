# Alpha Vision – Frontend (React + Vite)

**Alpha Vision** is an AI-powered Business Intelligence (BI) platform that empowers users to upload datasets, visualize trends, generate insights, and interact with their data through an intelligent chatbot interface — all from a responsive, modular UI.

This repository contains the **frontend application** built with **React + Vite** and connected to the backend powered by **FastAPI**.

---

##  Key Features

✅ Upload `.csv`, `.xls`, or `.xlsx` files for processing  
✅ Intelligent charting (bar, line, radar, pie, scatter, histogram, KDE)  
✅ Smart Query Bar for natural-language insights  
✅ In-dashboard **AI Chatbot** assistant  
✅ Real-time statistical summaries and regression metrics  
✅ Data correlation matrix  
✅ Report download (PDF)  
✅ JWT-secured login system (optional)

---

##  UI Highlights

| Landing & Upload | Predictions | User Analytics |
|------------------|-------------|----------------|
| ![Home](./screenshots/alpha_home.png) | ![Prediction](./screenshots/alpha_predictions.png) | ![Analytics](./screenshots/alpha_dashboard.png) |



---

## 🔧 Tech Stack

| Layer        | Technology               |
|--------------|--------------------------|
| Framework    | React (Vite)             |
| Styling      | Custom CSS + Variables   |
| Charting     | Chart.js (`react-chartjs-2`) |
| State Mgmt   | useState, useEffect, useMemo |
| Chatbot      | Dashboard-integrated AI Assistant |
| Data Requests| Fetch/POST to FastAPI backend |
| Deployment   | Vercel / Netlify-ready   |

---

## Getting Started

### 1 Clone the repo

```bash
git clone https://github.com/your-username/alpha-vision-frontend.git
cd alpha-vision-frontend
