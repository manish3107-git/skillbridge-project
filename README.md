# SkillBridge - AI-Powered Career Bottleneck Detection & Improvement Platform

> **Core Purpose:** Understand why a candidate is failing to convert their existing skills into job opportunities, identify their primary career bottleneck, and recommend the highest-impact next action.

---

## 🚀 Unique Product Loop

```
Candidate Evidence
  → Analyze
  → Detect Career Bottleneck
  → Explain Why
  → Recommend Next Best Action
  → Candidate Completes Action
  → Reassess
  → Measure Improvement
```

---

## 🏗️ Tech Stack & Architecture

- **Frontend:** React.js, Vite, React Router DOM, Recharts, Lucide React, Modern CSS System (Dark Luxury SaaS Theme)
- **Backend:** Node.js, Express.js, REST API, JWT Authentication, BcryptJS
- **Database:** Supabase PostgreSQL (16 normalized tables)
- **AI Service:** Dedicated Backend Service (`backend/src/services/ai/ai.service.js`) with LLM integration and deterministic mock engine fallback.

---

## 📂 Project Structure

```
hackathon-project-niat/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & Supabase configuration
│   │   ├── db/              # schema.sql and seed.sql
│   │   ├── middleware/      # JWT Authentication & Error Handlers
│   │   ├── services/ai/     # Central AI Engine Service
│   │   └── server.js        # Main Express API server
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/         # AuthContext for JWT management
│   │   ├── services/        # Central API client
│   │   ├── App.jsx          # React Router & Navbar container
│   │   ├── index.css        # Luxury dark SaaS design system
│   │   └── main.jsx         # React DOM entry
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── README.md
└── package.json             # Monorepo setup scripts
```

---

## 🔑 Environment Variables Required

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

JWT_SECRET=skillbridge_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=7d

# Optional LLM API Key (If blank, uses deterministic fallback engine)
LLM_API_KEY=
LLM_PROVIDER=openai

CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🛠️ How to Setup & Run

### 1. Install Dependencies
Run from the project root:
```bash
npm run setup
```
*(Or install manually in `backend` and `frontend` using `npm install`)*

### 2. Start Backend API
```bash
npm run dev:backend
```
Server runs at `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

### 3. Start Frontend Client
```bash
npm run dev:frontend
```
App opens at `http://localhost:5173`

---

## 📊 Database Plan & Tables

Database schema script is available at [backend/src/db/schema.sql](file:///c:/Users/manis/OneDrive/Desktop/hackathon-project-niat/backend/src/db/schema.sql).
Demo seed script is available at [backend/src/db/seed.sql](file:///c:/Users/manis/OneDrive/Desktop/hackathon-project-niat/backend/src/db/seed.sql).

Tables included:
1. `users`
2. `candidate_profiles`
3. `skills`
4. `candidate_skills`
5. `projects`
6. `resumes`
7. `jobs`
8. `job_requirements`
9. `assessments`
10. `assessment_results`
11. `applications`
12. `interviews`
13. `career_diagnoses`
14. `recommendations`
15. `action_plans`
16. `progress_snapshots`
17. `organization_profiles`
