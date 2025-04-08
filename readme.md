# VHealth – Virtual Health Consultation System

VHealth is a full-stack web application that enables seamless virtual consultations between patients and doctors. It features secure authentication, real-time interaction, prescription management, and appointment scheduling. The system is designed for scalability and extensibility, with a modern frontend and robust backend.

---

## 🚀 Features

- 👨‍⚕️ **Role-based Authentication** via Clerk (Doctor, Patient)
- 🗓️ **Appointment Booking**
- 💊 **Prescription Upload & History**
- 📦 **MERN Stack** (MongoDB, Express.js, React.js, Node.js)
- 📞 **Real-time Chat** between Doctor & Patient (with WebSockets)

---

## 🛠️ Tech Stack

### Frontend:

- React (Vite)
- Tailwind CSS
- Clerk Authentication
- React Router
- Axios

### Backend:

- Node.js + Express.js
- MongoDB + Mongoose
- WebSocket for chat
- dotenv for environment config

---

## 🔐 Authentication Flow

- **Clerk** handles secure sign-up/login flows
- Separate routes/components for:
  - `/doctor/signup`
  - `/patient/signup`
  - `/doctor/login`
  - `/patient/login`

---

## ⚙️ Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/vhealth.git
cd vhealth
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
nodemon server.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🔑 Environment Variables

### Backend `.env`

```env
MONGO_URI=your_mongodb_uri
PORT=5000
```

### Frontend `.env`

```env
VITE_CLERK_FRONTEND_API=your_clerk_key
```

---

## 📸 UI Pages

- `/{role}/login` — Login screen (Clerk)
- `/{role}/dashboard` — Role-based redirect
- `/{role}/history` — Prescription history

---

## 📦 Deployment

- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas
- Add CORS and Clerk callback URLs in respective dashboards.

---

## 🤝 Contribution

- Fork the repository
- Create a new branch: `git checkout -b feature-name`
- Commit your changes: `git commit -m "Added feature"`
- Push to branch: `git push origin feature-name`
- Create a pull request

---

## 📄 License

MIT License © 2025 Divyanshu Tyagi

---

## 🔗 Useful Links

- [Clerk Docs](https://clerk.dev/docs)
- [Vite Docs](https://vitejs.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
