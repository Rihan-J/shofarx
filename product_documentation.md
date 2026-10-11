# 🚀 Product Overview: Dynamic AI-Powered Portfolio

This document provides a comprehensive overview of the **Rihan J - Full Stack Personal Portfolio Website**. It explains what the product is, its core architecture, the complete user and admin workflows, and the various external and internal APIs powering it.

---

## 📌 1. What is this Product?

This product is a **highly interactive, dynamic, and CMS-backed personal portfolio website**. Unlike traditional static HTML/CSS portfolios, this application is a full-stack platform. 

It serves two main purposes:
1. **Public Identity Hub**: A visually stunning front-end showcasing the developer's projects, skills, achievements, and contact information. It features a modern design (dark mode, glassmorphism, Framer Motion animations) to impress recruiters and clients.
2. **Private Administrative Backend (CMS)**: A secure, authenticated dashboard for the owner to dynamically manage their content. The owner can add new projects, update skills, or read contact messages without ever touching the source code.
3. **Interactive AI Assistant**: A floating chat widget powered by a Large Language Model (LLM) that acts as a personal assistant. It reads the website's database in real-time to answer visitors' questions about the owner's experience.

**Tech Stack Highlights:**
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Vercel Serverless Functions (`/api/*`), Node.js.
- **Database**: Neon (Serverless PostgreSQL).
- **Authentication**: JWT (`jose`), `bcryptjs`.

---

## ⚙️ 2. How it Works (Architecture)

The system is decoupled into a frontend React application and a serverless backend API.

1. **Frontend Rendering**: The Vite + React application runs in the user's browser. When the page loads, React Query (`@tanstack/react-query`) makes asynchronous requests to fetch the latest data for sections like Projects, Skills, and Achievements.
2. **Serverless Backend**: The requests hit Vercel Serverless Functions (`/api/projects`, `/api/skills`, etc.). These functions act like lightweight, on-demand backend servers.
3. **Database Communication**: The serverless functions use the `@neondatabase/serverless` driver to securely query the Neon PostgreSQL database and return the data as JSON to the frontend.
4. **State & Animations**: As data streams in, Zustand, React hooks, and Framer Motion orchestrate smooth entrance animations and layout shifts.

---

## 🔄 3. Complete Workflow

There are two primary workflows in the application depending on who is using it.

### Workflow A: The Public Visitor (Recruiter / Client)
1. **Landing**: The user visits the website. The hero section loads immediately static content for speed.
2. **Dynamic Hydration**: As the user scrolls, the frontend fetches data from `/api/projects`, `/api/skills`, and `/api/achievements`.
3. **Engaging the AI**: 
   - The user opens the floating chat widget and asks, *"What React projects have you built?"*
   - The frontend sends the query to `/api/ai`.
   - The server function fetches all published projects/skills from NeonDB, builds a context prompt, and sends it to the **Groq API**.
   - Groq's LLM interprets the database context, formulates a human-like response, and streams it back to the visitor.
4. **Contacting the Owner**:
   - The visitor fills out the contact form.
   - The request goes to `/api/contact`. 
   - The API uses **Upstash Redis** to check if the user is rate-limited (preventing spam). If allowed, it saves the message into the `contact_messages` table in NeonDB.

### Workflow B: The Admin (Portfolio Owner)
1. **Login**: The owner navigates to `/admin` and inputs their credentials.
2. **Authentication**: `/api/auth/login` verifies the hashed password using `bcryptjs` and signs a secure JWT using `jose`, storing it in an HttpOnly cookie.
3. **Content Management Layer**:
   - The owner is redirected to the CMS Dashboard.
   - They can view traffic analytics, read incoming contact messages, and modify site content (Projects, Skills, etc.).
   - **Uploading Assets**: If the owner adds a new project thumbnail, the request goes to `/api/upload` which securely authenticates and uploads the file to **Cloudinary**, saving the returned URL into NeonDB.
4. **Publishing**: When the owner hits "Save" or "Publish", the Neon database is updated instantly. The next time a public visitor reloads the site (or asks the AI), they see the brand-new data.

---

## 🔌 4. APIs Being Used

The product relies heavily on a micro-service approach, combining internal Vercel endpoints with powerful external third-party APIs.

### External Third-Party APIs
1. **Neon API / Serverless PostgreSQL Driver**:
   - **Purpose**: Relational database hosting. Stores all structural data (projects, skills, credentials, messages).
   - **Technology**: Uses `@neondatabase/serverless` to run standard SQL queries over edge-friendly HTTP connections instead of persistent TCP.
2. **Groq API (Llama 3 / Mixtral)**:
   - **Purpose**: Powers the site's AI Assistant.
   - **Technology**: Receives a strict system prompt containing the site's NeonDB content and answers conversational questions dynamically. 
3. **Upstash API (Redis)**:
   - **Purpose**: Rate limiting (preventing DDoS and form spamming) and high-speed temporary caching.
   - **Technology**: `@upstash/redis` and `@upstash/ratelimit`. Used specifically on the `/api/contact` route.
4. **Cloudinary API**:
   - **Purpose**: Secure media management and cloud object storage. 
   - **Technology**: Used to upload and serve optimized images for the admin CMS.
5. **EmailJS API** *(referenced/optional configuration)*:
   - **Purpose**: To trigger email notifications when someone submits the contact form.

### Internal Proprietary APIs (Vercel Serverless Functions)
The `/api/*` directory acts as the bridge between the frontend and the database/external APIs:
- `GET /api/projects`: Fetches and parses published project objects.
- `POST /api/contact`: Handles contact form submissions with Zod validation + Upstash Rate Limiting.
- `POST /api/ai`: Coordinates the prompt engineering between the Neon DB context and Groq API.
- `POST /api/upload`: Handles multipart form data for image uploads to Cloudinary.
- `POST /api/auth/login`: Handles admin authentication and issues JWT secure cookies.
- `/api/admin/*`: Fully protected routes (like `/api/admin/projects/[id].ts`) for executing CRUD operations that require a valid Admin JWT token.
