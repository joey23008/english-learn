# English Learn — Full-Stack Language Learning & CMS Platform

**English Learn** is a scalable, full-stack web application designed to streamline English language education through interactive lessons, structured curriculum management, and real-time progress tracking. 

Built with modern TypeScript, React (Next.js), and a relational database architecture, this project demonstrates clean code practices, modular UI design (Atomic Design), and robust RESTful API development.

---

## 🎯 Key Features

### 1. Interactive Learning Portal (Frontend)
* **Structured Curriculum:** Navigate seamlessly through Lessons, Chapters, Questions, Sentences, and Key Phrases.
* **Dynamic Study Interface:** Interactive components for sentence ordering, phrase matching, and response submission with instant feedback.
* **Global Progress Tracking:** Real-time state management tracking user completion and learning milestones across sessions.

### 2. Content Management Dashboard (Admin/CMS)
* **Full CRUD Operations:** Intuitive dashboard interface allowing educators/admins to create, edit, reorder, and delete lessons, chapters, questions, and phrases.
* **Rich Editing Experience:** Custom modal dialogs, inline editing, and validation pipelines to ensure data integrity.

### 3. Authentication & Security
* **User Management:** Secure signup, login, and session management workflows with protected routes and API endpoints.

---

## 🛠 Tech Stack & Architecture

This application is engineered with a focus on maintainability, type safety, and containerized deployment:

* **Frontend:** React, Next.js (Pages Router), TypeScript
* **Styling:** SCSS Modules, Tailwind CSS
* **Backend & API:** Next.js API Routes (RESTful architecture), Axios
* **Database & ORM:** PostgreSQL / Relational DB, Drizzle ORM (with version-controlled schema migrations & seeders)
* **Infrastructure & DevOps:** Docker, Docker Compose, DevContainers
* **Architecture & Design Patterns:**
  * **Atomic Design:** UI components strictly organized into `atoms`, `molecules`, and `organisms` for maximum reusability.
  * **Custom Hooks & Context Providers:** Clean separation of business logic and UI state (`useAuth`, `useLessons`, `useGlobalProgress`, etc.).
  * **API Testing:** Integrated `.http` test suites for all endpoints to ensure reliable execution and easy debugging.

---

## 📂 Project Structure

```text
english-learn/
├── http/                  # REST Client (.http) scripts for API endpoint testing
├── public/                # Static assets
├── src/
│   ├── components/        # UI components structured via Atomic Design
│   │   ├── atoms/         # Basic building blocks (Buttons, Inputs, Alerts)
│   │   ├── molecules/     # Composite components (Tables, Dialogs, Accordions)
│   │   └── organisms/     # Complex feature sections (Dashboard CMS, Lesson Views)
│   ├── consts/            # Application constants, HTTP status codes, regex
│   ├── hooks/             # Custom React hooks for data fetching & UI logic
│   ├── infra/db/          # Drizzle ORM schema, migrations, and database seeders
│   ├── lib/               # Core utilities (Auth, Axios interceptors, Token handling)
│   ├── pages/             # Next.js routing (Frontend views, Dashboard, & REST APIs)
│   ├── providers/         # React Context providers for global state management
│   ├── styles/            # Global SCSS styles and variables
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Helper functions and validation logic
├── docker-compose.yaml    # Multi-container Docker setup
├── Dockerfile             # Production container image configuration
└── drizzle.config.ts      # Drizzle ORM configuration
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* Docker & Docker Compose

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/joey23008/english-learn.git
   cd english-learn
   ```

2. **Configure environment variables:**
   Copy the example environment file and update the database credentials and secrets as needed.
   ```bash
   cp .env.example .env.development
   ```

3. **Start the database and services via Docker:**
   ```bash
   docker-compose up -d
   ```

4. **Install dependencies and run migrations:**
   ```bash
   npm ci
   npm run db:push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👨‍💻 About the Developer

Developed by a **Full-Stack Engineer with 10+ years of experience** specializing in TypeScript, React, Next.js, Node.js, and cloud-native architectures. This repository showcases my approach to building clean, scalable, and production-ready web applications from database schema design to responsive frontend execution.