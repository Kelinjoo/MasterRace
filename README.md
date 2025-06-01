# MasterRace 🖥️

MasterRace is a full-stack web platform for PC building and community interaction, created as a final seminar project for Systems III. It empowers users to create posts, interact socially, and build their own custom PC with real-time compatibility validation.

## 🚀 Features

### ✅ Authentication And Registration
- Register and log in with JWT-secured tokens
- Role-based access (User / Admin)

### 🧑‍💻 User Profile
- Edit username, password, bio, and profile picture
- View your own posts and edit/delete them

### 📬 Post System
- Create, edit, delete posts (with optional image)
- Like/unlike posts
- Comment system with full CRUD and admin moderation

### 🧠 Build My PC Tool
- Select compatible components (CPU, GPU, RAM, Motherboard, Storage, PSU, Case)
- Compatibility is checked bidirectionally via stored relationships
- Admin interface to add new parts and define compatibility links
- Users can view, edit, or delete their saved builds

### 🔐 Admin Tools
- Add parts and define compatibility
- Delete any user’s comment, or edit/delete any post

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Bootstrap 5
- Axios

**Backend**
- Node.js + Express
- MySQL with mysql2/promise
- JWT for authentication

---

## 🧪 Compatibility Logic

The compatibility system checks **all pairs of selected parts** using the `compatibility` table. The relationship is **bidirectional**, meaning if part A is compatible with B, then B must also be compatible with A. Dummy compatibility entries are required for parts like RAM–GPU, even if always compatible, to ensure proper pairing validation.

---

## 🔧 Backend Initialization

in bash:
cd server
node index.js

## 🔧 Frontend Initialization

in bash:
cd client
npr run dev

---

## 📚 Credits

- Dejan Kelecevic 89191118
- University of Primorska – Computer Science
- Implementation Project for Systems III (2025)
---
