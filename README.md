# MERN MCQ Quiz App

Timed quiz platform built with the MERN stack. All questions, answers, and explanations live in MongoDB, the Express API serves them to the React client, and a countdown timer forces automatic submission when time runs out. 

> **Author:** Syed Aman Rukhsar  
> **Email:** syedamanruksar3@gmail.com

---

## Features

- 🎯 **Question Bank in MongoDB** – Each question stores four options, the correct index, and an explanation.
- 🕑 **10-Minute Countdown** – The quiz auto-submits when the timer hits zero.
- 🧭 **Single-Question Navigation** – Move via Next/Previous, navigator pills, or skip ahead; submit only on the last question.
- 📊 **Result Review** – After submission, see score plus per-question status, user answer, correct answer, and explanation.
- 🎨 **Responsive UI** – Modern gradient theme with subtle animations built on Vite + React.

---

## Tech Stack

- **Frontend:** React 18, Vite, CSS modules
- **Backend:** Node.js, Express
- **Database:** MongoDB / Mongoose
- **Tooling:** Nodemon, dotenv

---

## Project Structure

```
Quiz-app/
├── client/        # React (Vite) frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── env.example
├── server/        # Express backend
│   ├── src/
│   │   ├── index.js
│   │   ├── models/Question.js
│   │   ├── routes/questionRoutes.js
│   │   ├── utils/db.js
│   │   └── scripts/seedQuestions.js
│   └── env.example
└── README.md
```

---

## Getting Started (Local Setup)

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```

2. **Install Node.js dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure environment variables**
   - Backend: `cp server/env.example server/.env` and set `MONGODB_URI` (Atlas SRV or local `mongodb://127.0.0.1:27017/quiz_app`).
   - Frontend: `cp client/env.example client/.env` and adjust `VITE_API_BASE_URL` if the API does not run on `http://localhost:5000`.

4. **Seed MongoDB with sample questions**
   ```bash
   cd server
   npm run seed
   ```

5. **Start both servers (in separate terminals)**
   ```bash
   # Backend
   cd server
   npm run dev

   # Frontend
   cd client
   npm run dev
   ```

6. **Open the app** – Vite prints a local URL (usually `http://localhost:5173`). Ensure the backend stays running to serve questions.

---

## Available Scripts

### Backend (`server`)
- `npm run dev` – Start Express with Nodemon.
- `npm start` – Start in production mode.
- `npm run seed` – Clear and repopulate the `Question` collection with five MCQs.

### Frontend (`client`)
- `npm run dev` – Start Vite dev server with hot reload.
- `npm run build` – Production build to `client/dist`.
- `npm run preview` – Preview the production build locally.

---

## API

| Method | Endpoint            | Description                                  |
| ------ | ------------------- | -------------------------------------------- |
| GET    | `/api/questions`    | Returns all questions without `__v` metadata |

Each question document:
```json
{
  "_id": "...",
  "prompt": "Which JavaScript method ...?",
  "options": ["JSON.parse()", "..."],
  "correctIndex": 0,
  "explanation": "Use JSON.parse() ..."
}
```

---

## Production / Deployment Tips

- Set `MONGODB_URI` to your production cluster and `PORT` as needed.
- Build the frontend (`npm run build` in `client`) and deploy via Netlify/Vercel or serve statically.
- Deploy the backend to services such as Render, Railway, or Heroku. Update `VITE_API_BASE_URL` accordingly.

---

## License

This project is maintained by **Syed Aman Rukhsar**. Feel free to fork and customize for personal or educational use; please credit the original author when publishing.
