# 🎮 GameStore - Your Ultimate Digital Gaming Hub

**GameStore** is a high-performance, full-stack web application designed for gamers to explore, search, and manage their gaming library. Built with the **MERN Stack**, it features a cinematic UI, secure authentication, and real-time game data integration.

---

## 🚀 Key Features

* **Dynamic Home Dashboard**: Custom-built sections for **Recommended**, **Trending**, and **Free-to-Play** games.
* **Immersive Horror Section**: A dedicated "Horror Archive" with a specialized dark-crimson theme and real-time popularity filtering.
* **Smart Search**: Instant game lookup powered by the RAWG Video Games Database API.
* **Community Players Page**: A social hub to view other gamers, their bios, and profiles.
* **User Authentication**: Secure Login/Signup with **JWT (JSON Web Tokens)** and multi-identifier support (Email, Username, or Mobile).
* **Interactive UI**: Cinematic "Snake Border" animations, neon glow effects, and fully responsive layouts.

---

## 🛠️ Tech Stack

### **Frontend**
* **React.js**: For a fast, component-based user interface.
* **React Router**: To handle multi-page navigation (Home, Horror, Users, Browse).
* **CSS3 (Custom)**: Advanced animations, flexbox/grid systems, and neon gaming aesthetics.
* **React Icons**: For high-quality gaming and UI icons.

### **Backend**
* **Node.js & Express**: Scalable backend architecture.
* **MongoDB & Mongoose**: Flexible NoSQL database for player profiles and data storage.
* **JWT & Bcrypt**: Industry-standard security for password hashing and authentication.
* **REST API**: Structured endpoints for user management and profile updates.

---

## ⚙️ Installation & Setup

To run this project locally, follow these steps:

### **1. Clone the Repository**
```bash
git clone [https://github.com/sriram-cod-03/gamestore.git](https://github.com/sriram-cod-03/gamestore.git)
cd gamestore
```
### **2. Install Dependencies**
```bash
# For Backend
cd Back-end && npm install

# For Frontend
cd ../ && npm install
```
### **3. Environment Variables:
Create a .env file in the Back-end folder:**
```bash
# Database Connection (Railway/MongoDB Atlas)
MONGODB_URI=mongodb+srv://GameStore:Gamestore123@cluster0.auaxrju.mongodb.net/GameStore?retryWrites=true&w=majority&appName=Cluster0

# Frontend URL
CLIENT_URL=http://localhost:5173

# Secret Key for JWT Authentication
JWT_SECRET=GameStore_Super_Secret_Key_2026

# Environment Mode
NODE_ENV=production

# Server Port
PORT=5000
```

### **4. lanunch the Gamestore**
```bash
# Run Backend (Terminal 1)
npm start

# Run Frontend (Terminal 2)
npm run dev
```
---

## 👨‍💻 Developer Profile

**Sriram** *Full-Stack Developer & Game Systems Designer* * **GitHub**: [@sriram-cod-03](https://github.com/sriram-cod-03)
* **LinkedIn**: linkedin.com/in/sriram-r-6383ba2a9
* **Education**: B.E Computer Science & Engineering, **Anna University**

> "Building immersive digital experiences one commit at a time." 🚀

---

## 📜 License

This project is licensed under the **MIT License**. 

Copyright (c) 2026 **sriram-cod-03**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

*See the [LICENSE](LICENSE) file for the full legal text.*
