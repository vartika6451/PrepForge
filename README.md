# PrepForge — Developer Learning & Interview Preparation Platform

> **Tagline:** Learn. Practice. Build.  
> **Mission:** A centralized developer preparation platform that curates high-quality learning resources, 18 DSA problem-solving patterns, full-stack technology masterclasses, in-depth technical interview questions, portfolio-worthy project blueprints, and structured career roadmaps.

---

## 🚀 Overview

PrepForge is engineered as a developer tool designed to bridge the gap between algorithmic problem-solving and real-world software engineering:

1. **18 DSA Patterns Directory**: Master problem-solving patterns (Two Pointers, Sliding Window, Monotonic Stacks, DP, etc.) with recognition clues, algorithmic approaches, pitfalls, and curated genuine problem links to LeetCode and other platforms.
2. **Developer Hub (9 Technologies)**: Deep dive into JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, Git, and System Design with staged roadmaps, free official docs, verified paid courses, interview questions, and real projects.
3. **Interview Preparation**: Searchable question directory with original explanations, execution sequence walkthroughs, output predictions, and practical code examples.
4. **Project Lab (16 Blueprints)**: Real software projects with phased implementation milestones, tech stack decisions, skills learned, and official documentation reference links.
5. **Structured Roadmaps**: 4 comprehensive tracks (Full-Stack Engineer, Frontend Specialist, Backend & Systems, DSA Mastery) linking patterns, technologies, and projects.
6. **Global Search**: Instant keyboard-driven command palette (`⌘K` / `Ctrl+K`) searching across patterns, questions, technologies, and projects.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router with React Server Components & Streaming SSR)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Data Architecture**: Strongly typed local seed data repository with PostgreSQL + Prisma ORM integration
- **Validation**: Zod schema validation
- **Deployment**: Vercel & Node.js

---

## 📂 Project Architecture

```
PrepForge/
├── prisma/
│   ├── schema.prisma        # Relational PostgreSQL schema (Pattern, Technology, DSAQuestion, etc.)
│   └── seed.ts              # Database seeding script
├── public/                  # Static assets & icons
├── src/
│   ├── app/
│   │   ├── api/search/      # Global search API route handler
│   │   ├── developer/       # Developer Hub directory & [slug] masterclass pages
│   │   ├── dsa-patterns/    # DSA Patterns directory & [slug] pattern deep dives
│   │   ├── interview-questions/ # Technical interview questions & [techSlug]/[slug] pages
│   │   ├── projects/        # Project Lab directory & [slug] project blueprints
│   │   ├── roadmaps/        # Career roadmaps & [slug] interactive timelines
│   │   ├── globals.css      # Design system variables, charcoal theme & styling
│   │   ├── layout.tsx       # Root layout with Header, Footer, and fonts
│   │   ├── page.tsx         # Homepage with Hero, live console, and previews
│   │   ├── not-found.tsx    # 404 handler
│   │   ├── robots.ts        # SEO robots.txt
│   │   └── sitemap.ts       # Dynamic sitemap generator
│   ├── components/
│   │   ├── dsa/             # PatternDirectory & PatternQuestionsList
│   │   ├── interview/       # InterviewDirectory client filter
│   │   ├── layout/          # Header, Footer, and SearchModal (⌘K)
│   │   ├── projects/        # ProjectDirectory client filter
│   │   └── ui/              # DifficultyBadge, PlatformBadge, CodeBlock, InteractiveConsole
│   ├── data/                # Strongly typed seed datasets
│   │   ├── patterns.ts      # 18 algorithmic patterns with recognition clues & pitfalls
│   │   ├── questions.ts     # Verified LeetCode problem links with editorial notes
│   │   ├── technologies.ts  # 9 full-stack technology entities
│   │   ├── resources.ts     # Curated free docs and verified paid course listings
│   │   ├── interview-questions.ts # In-depth technical interview questions
│   │   ├── projects.ts      # 16 production-grade project blueprints
│   │   └── roadmaps.ts      # 4 multi-stage career roadmaps
│   ├── lib/
│   │   ├── data/index.ts    # Centralized data access layer & search logic
│   │   └── utils.ts         # Formatting and Tailwind merge helpers
│   └── types/
│       └── index.ts         # TypeScript entity interfaces and contracts
├── .env.example             # Example environment configuration
├── package.json
└── tsconfig.json
```

---

## ⚡ Quickstart & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Full-Stack Application
Because PrepForge is built on Next.js App Router, both frontend UI and backend server routines execute seamlessly together:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
Verify TypeScript compilation and static page generation:

```bash
npm run build
npm run start
```

---

## 🗄️ Database Configuration & Prisma (Optional)

PrepForge comes pre-configured with a rich, typed seed data repository (`src/data/`) that powers the complete application out of the box without requiring database credentials.

To connect your own PostgreSQL database for persistent records:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update `DATABASE_URL` with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/prepforge?schema=public"
   ```
3. Generate the Prisma client & push schema migrations:
   ```bash
   npx prisma db push
   ```
4. Seed the database with the curated dataset:
   ```bash
   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
   ```
5. Launch the Prisma Studio database GUI:
   ```bash
   npx prisma studio
   ```

---

## 🔍 Features & Interaction Guide

- **Global Search (`⌘K` / `Ctrl+K`)**: Press `⌘K` or click the search control in the header to search across all patterns, questions, technologies, and projects in real time.
- **Pattern Recognition**: Each pattern detail page specifies exact recognition clues to help you identify when to apply the pattern during real interviews.
- **Genuine Problem Links**: External DSA problem links open genuine problem URLs on LeetCode/HackerRank safely in a new tab (`rel="noopener noreferrer"`).
- **Phased Project Blueprints**: Each project details a real-world problem statement, core features checklist, phased implementation milestones, and official documentation links.

---

## 🚀 Deployment

The project is structured for 1-click deployment on [Vercel](https://vercel.com):

1. Push your changes to GitHub on the `vartika` branch:
   ```bash
   git push origin vartika
   ```
2. Import the repository into the Vercel dashboard.
3. Configure `NEXT_PUBLIC_APP_URL` (and optional `DATABASE_URL` if using Postgres).
4. Deploy!
