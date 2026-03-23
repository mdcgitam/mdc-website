# 🌐 MDC GITAM Website

A modern, interactive website for **Meta Developer Communities (MDC) at GITAM**, designed to showcase the club’s team, events, and academic journey with a clean and dynamic user experience.

---

## 🚀 Features

- ✨ Modern UI with glassmorphism & smooth animations
- 👥 Complete Team Showcase (Executive Board + Domains)
- 📅 Academic Tenure-wise structure (2022–26)
- 🎯 Dynamic Events Section (Firebase integrated)
- 🔐 Admin Dashboard to upload event images
- 📸 Image-based event highlights with descriptions
- 📩 Contact page with direct Gmail integration

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Framer Motion
- **Backend/Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Admin access)
- **UI Components:** Swiper.js (Carousels)

---

## 📂 Project Structure
src/
│
├── components/
│   ├── home/
│   ├── about/
│   ├── layout/
│
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Events.jsx
│   ├── ContactUs.jsx
│   ├── AdminLogin.jsx
│   ├── AdminDashboard.jsx
│
├── data/
│   └── tenureData.js
│
├── firebase/
│   └── firebase.js

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/mdcgitam/mdc-website
cd mdc-website
npm install 
```\bash

Create a Firebase project and enable:
	•	Firestore Database
	•	Authentication (Email/Password) 
make sure that the firebase connection is perfect

Then add your config in:
src/firebase/firebase.js

```bash
npm run dev
```\bash

🔐 Admin Features
	•	Admin login system
	•	Upload event images
	•	Events stored in Firestore
	•	Automatically reflected on website

🎨 Design Highlights
	•	Smooth scrolling animations
	•	Glassmorphism UI elements
	•	Infinite carousels for team & events
	•	Clean typography using Outfit font

🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

