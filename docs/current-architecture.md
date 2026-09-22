# PlanRupee — Current Architecture Assessment & Audit

**Date**: September 22, 2026  
**Repository**: [https://github.com/palakv07/planrupee](https://github.com/palakv07/planrupee)  
**Assessor**: Full-Stack Architecture Team  
**Core Product Philosophy**: *AI Plans. Locals Advise. Concierge Executes.*

---

## 1. Executive Summary & Overview

PlanRupee is a modern, high-polish travel platform prototype designed to deliver hyper-personalized itineraries, verified local insider consultations, and 5-star human concierge execution for Indian destinations (initiating with Chandigarh, Patiala, and Rajpura).

The codebase currently functions primarily as a frontend-first Single Page Application (SPA) built with **React 19, TypeScript 5.8+, Tailwind CSS 3.4, and Vite 6/8**. While visually sophisticated and interactive, its application state historically relied on browser `localStorage` and static in-memory data structures, accompanied by an experimental Express backend in `server/index.ts`. 

This assessment establishes the technical baseline before progressively evolving PlanRupee into an enterprise-ready, production-grade product powered by a **FastAPI (Python) backend, PostgreSQL relational database, real JWT authentication, modular AI recommendation engine, and human concierge workflows**.

---

## 2. Current Architecture & Tech Stack

```
                       CURRENT ARCHITECTURE
┌────────────────────────────────────────────────────────────────────────┐
│  Frontend (React 19 + TypeScript + Vite + Tailwind CSS)                │
│  - Single Page Scroll Layout (Hero, Packages, Roadmap, Locals, etc.)   │
│  - State: React Context API (PlanRupeeContext.tsx)                     │
│  - Data Sources: Static TS files (places.ts, locals.ts, reviews.ts)    │
│  - Storage: Historically localStorage; partial prototype API bridge   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ (HTTP / JSON)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Prototype Backend (server/index.ts - Express 5 + pg Pool)             │
│  - Single monolithic file                                              │
│  - Stores all entities as untyped JSONB blobs: (id TEXT, data JSONB)   │
│  - No authentication, no user tables, no relational integrity         │
│  - No migration system (Alembic/Prisma missing)                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Dependencies & Tooling
- **Frontend Core**: React 19.2.8, React DOM 19.2.8, TypeScript 6.0.2 / 5.8
- **Icons & Effects**: `lucide-react` (1.47.0), `canvas-confetti` (1.9.4)
- **Styling**: `tailwindcss` (3.4.19), `postcss`, `autoprefixer`, `clsx`, `tailwind-merge`
- **Build / Lint**: `vite` (8.3.0), `@vitejs/plugin-react` (6.1.1), `oxlint` (1.81.0)
- **Experimental Server**: Express 5.1.0, `pg` (8.16.3), `cors`, `dotenv`, `tsx`

---

## 3. Existing Features

| Feature | Description | Current Implementation Status |
| :--- | :--- | :--- |
| **Hero & Trip Planner** | Form to pick city, dates, times, travelers, budget, moods, and interests. | Interactive UI with deterministic client generator; needs AI & backend persistence. |
| **Three Tier Overview** | Visual breakdown of Roadmap, Local Advice, and 5-Star Concierge. | Presentation component. Working well. |
| **Interactive Roadmap** | Day-by-day timeline (Morning, Afternoon, Evening, Dinner) with slot swap, deletion, addition, and day re-ordering. | Fully functional interactive UI; uses deterministic template generator. |
| **Local Marketplace** | Grid of local resident experts with filters by city & expertise. | Interactive UI with 4 initial locals; needs database backing and booking schedule. |
| **Local Profile Modal** | Detailed modal showcasing local picks, reels, languages, pricing, and reviews. | Interactive UI; working well with mock reels and static picks. |
| **Local Booking Flow** | Modal to book consultation with date, time, travelers, and questions. | Client modal triggering state updates; needs real availability, payments, and DB records. |
| **5★ Luxury Concierge** | Category selection, request query input, city, timing, budget, contact details. | Interactive submission; simulates pipeline with client timer; needs real operator workflow. |
| **Concierge Tracker** | Modal tracking request pipeline: Received → Concierge → Partner → Confirmed → Completed. | Interactive modal; has demo "Simulate Next Stage" button. |
| **Place Discovery** | Category filters (Food, Café, Heritage, Shopping, Nature, Hidden Gem), search, details modal. | Rich curated dataset (18 places); client-filtered. |
| **Place Details Modal** | Photo gallery, description, why recommended, best time, pricing, verified reviews. | Working well; allows launching review submission. |
| **Review System** | Multi-dimensional rating (food, ambience, value / knowledge, helpfulness) + comments. | Submits to client state; needs authentication & server-side rating aggregation. |
| **Admin Portal** | Modal with tabs for places, locals, reviews, concierge status, and adding places. | Client modal directly mutating context state; needs role-based access control (`ADMIN`). |
| **User Dashboard** | Workspace modal with tabs for Roadmaps, Consultations, Concierge Requests, Saved Places/Locals, Reviews. | Client-side aggregation; needs real user identity and server synchronization. |
| **Become a Local** | Multi-step onboarding application for residents. | Submits to confetti animation without persistent backend record. |
| **Data Loop Section** | Explains community flywheel and training of recommendation engine. | Static marketing section. |

---

## 4. Existing Reusable Components

Located in `src/components/`:
- **Navbar** (`Navbar.tsx`): City switcher dropdown, anchor navigation, counters for saved items and bookings, action triggers.
- **VerificationBadge** (`common/Badge.tsx`): Standardized badges for `verified`, `user_generated`, `demo`, and category tags.
- **Hero** (`Hero.tsx`): Trip planner form with pill toggles, calendar inputs, traveler selection.
- **RoadmapSection** (`RoadmapSection.tsx`): Timeline visualizer with day pills, slot cards, activity editor modals.
- **LocalMarketplace** (`LocalMarketplace.tsx`): Card grid with filters and quick consultation booking.
- **PlaceDetailsModal** (`PlaceDetailsModal.tsx`): Modular drawer/modal for place inspection.
- **UserDashboardModal** (`UserDashboardModal.tsx`): Tabbed user workspace for bookings, trips, and bookmarks.
- **AdminPanelModal** (`AdminPanelModal.tsx`): Admin management interface for content verification.

---

## 5. Existing Data Models & Types

Defined in `src/types/index.ts`:
- **`City`**: `'Chandigarh' | 'Patiala' | 'Rajpura'`
- **`VerificationStatus`**: `'verified' | 'user_generated' | 'demo' | 'unverified'`
- **`PlaceCategory`**: 10 categories (`Food`, `Café`, `Heritage`, `Shopping`, `Nature`, `Nightlife`, `Spiritual`, `Family`, `Photography`, `Hidden Gem`)
- **`TripMood` & `Interest`**: Taxonomy for travel intent
- **`Place`**: Full metadata including `coordinates`, `priceLevel`, `approxCostInr`, `rating`, `reviewCount`, `verificationStatus`, `whyPlanRupeeRecommends`
- **`Local`**: Profile attributes including `consultationFee`, `localPicks`, `reels`, `expertise`, `languages`
- **`PlaceReview` & `LocalReview`**: Multi-criteria review schemas
- **`Roadmap`, `RoadmapDay`, `RoadmapActivity`**: Structured multi-day itineraries
- **`ConciergeRequest`, `ConciergeUpdate`, `ConciergeStatus`**: Pipeline tracking
- **`ConsultationBooking`**: Booking record with status and fee

---

## 6. Existing State Management & Storage Analysis

### State Management
- All global state is concentrated in `src/context/PlanRupeeContext.tsx`.
- Components consume this state via `usePlanRupee()`.
- State updates mutate in-memory React arrays (`places`, `locals`, `placeReviews`, `localReviews`, `activeRoadmap`, `myConsultations`, `myConciergeRequests`, `savedPlaceIds`, `savedLocalIds`).

### Storage & Prototype API Analysis
- Originally, `PlanRupeeContext.tsx` synced state to browser `localStorage` under keys `planrupee_places`, `planrupee_active_roadmap`, etc.
- In a previous commit, localStorage setters were commented out or removed, and an initial `api.ts` module with `/api/bootstrap` was introduced.
- **Deficiencies Identified**:
  - The prototype Express server stored everything in `JSONB` blobs without foreign keys, constraints, or relational schema.
  - Initial load had a mount race condition: the default client roadmap could overwrite database state before bootstrap finished.
  - There is no user authentication, session management, or user scoping (all bookings and roadmaps belong to a single global client).
  - Several components use fake timers (`setTimeout`) to simulate backend processing (e.g. concierge progression in `PlanRupeeContext.tsx`, hardcoded reviewer `'Pranjal Traveler'`).

---

## 7. Technical Debt & Issues Identified

1. **Monolithic Architecture**: Frontend contains business logic, booking validation, rating aggregation, and simulated backend events.
2. **Missing Relational Schema**: Prototype backend stores unstructured JSONB blobs rather than normalized SQL tables (`users`, `trips`, `itinerary_days`, `activities`, `places`, `locals`, `bookings`, `reviews`, `saved_places`, `saved_locals`, `concierge_requests`).
3. **Absence of Authentication**: Anyone can trigger admin actions, book consultations without an identity, or submit reviews.
4. **Hard-coded Identities & Mock Timers**: 
   - `ReviewSubmissionModal.tsx` hard-codes author to `'Pranjal Traveler'`.
   - `submitConciergeRequest` uses `setTimeout` 4000ms to fake a status transition.
   - `ConciergeTrackerModal.tsx` contains a "Simulate Next Stage" demo button.
5. **Deterministic vs. AI Planning**: Roadmap generation in `roadmapGenerator.ts` is purely a modular arithmetic index picker; no natural language understanding or true personalization exists.
6. **No Payment Verification**: Local consultations immediately mark as `Confirmed` without payment order generation or webhook signature verification.
7. **Oxlint & Compiler Warnings**: Several components contain unused icons (`MapPin`, `Clock`, `Trash2`, etc.) and unused helper variables.

---

## 8. Strategy: Features to Preserve vs. Refactor

### Features to PRESERVE:
- **Visual Design & Design System**: High-contrast typography, minimalist monochrome palette with emerald/amber accents, pill selectors, and clean spacing.
- **Interactive Roadmap Visualizer**: Drag/swap/delete/optimize day UI in `RoadmapSection.tsx`.
- **Place Details & Local Profile UI**: High-converting, comprehensive modals.
- **Taxonomy & City Scope**: Rich initial datasets for Chandigarh, Patiala, and Rajpura.
- **Admin & Dashboard UI**: The operational interface structure is clean and should be hooked to real backend data.

### Features to REFACTOR:
- **State Flow**: Separate Server State from UI State using typed API service modules.
- **Backend Stack**: Transition from the temporary single-file Express JSONB script to a production-grade **FastAPI + SQLAlchemy 2.0 + PostgreSQL** backend.
- **Authentication**: Implement JWT auth with bcrypt password hashing; protect `/admin` and user dashboards.
- **Itinerary Engine**: Build a hybrid engine (Deterministic constraints + AI personalization via provider abstraction).
- **Booking & Concierge**: Real database-driven state machines; server-side slot availability and status updates.

---

## 9. Monorepo Target Architecture

We will structure the project as a clean, production-oriented monorepo:

```
PlanRupee/
├── frontend/                     # Existing React + TypeScript + Vite app
│   ├── src/
│   │   ├── components/           # Polished UI components
│   │   ├── context/              # UI state and Auth context
│   │   ├── services/             # Dedicated API service layer (api.ts, authService, tripService...)
│   │   ├── types/                # Strict TypeScript contracts
│   │   └── data/                 # Seed data and fallbacks
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # Production FastAPI + Python 3.14 backend
│   ├── app/
│   │   ├── api/                  # Versioned API routes (v1/auth, trips, places, locals, bookings, concierge, admin)
│   │   ├── core/                 # Config (pydantic-settings), security (JWT, bcrypt), logging
│   │   ├── db/                   # Database session, base model
│   │   ├── models/               # SQLAlchemy 2.0 relational models
│   │   ├── schemas/              # Pydantic v2 request/response schemas
│   │   ├── services/             # Business logic (trip_generator, ai_service, booking_service, concierge_service)
│   │   └── utils/                # Seed script, helpers
│   ├── tests/                    # Pytest test suite
│   ├── alembic/                  # Database migration management
│   ├── requirements.txt          # Python dependencies
│   └── main.py                   # FastAPI app entry point
├── docs/                         # Architectural and operational documentation
│   ├── current-architecture.md   # This document
│   ├── architecture.md           # System design & diagrams
│   ├── database.md               # Relational schema & indexing
│   ├── api.md                    # REST API reference
│   └── product-roadmap.md        # Feature phases & milestones
├── docker-compose.yml            # PostgreSQL 16 + Backend containerization
├── .env.example                  # Environment configuration template
└── README.md                     # Modern, productized project documentation
```

---

## 10. Phased Implementation Sequence

In strict compliance with the Productization Master Prompt:
- **Phase 1: Foundation**: Monorepo directory setup, FastAPI application, PostgreSQL models, Alembic migrations, secure JWT authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`), environment configuration, and frontend service layer foundation.
- **Phase 2: Core Product**: Relational persistence for Trips, Itineraries, Places, Reviews, and Saved Bookmarks; eliminating all localStorage dependencies.
- **Phase 3: Local Marketplace**: Local expert directory, onboarding flow (`/become-a-local`), server-side slot availability, booking lifecycle, and Local Dashboard.
- **Phase 4: AI Engine**: Hybrid recommendation engine with `AIProvider` abstraction (Gemini / OpenAI / Mock), structured itinerary JSON generation, and natural-language re-planning.
- **Phase 5: Payments**: Razorpay-ready order generation, webhook signature verification, and automated booking confirmation.
- **Phase 6: Concierge Operations**: Real-time request pipeline, operator assignment, audit trail notes, and notifications.
- **Phase 7: Production Readiness**: Automated test suites (pytest + vitest/tsc), admin dashboard enforcement, security hardening, performance optimizations, and comprehensive documentation.

*Assessment completed. Ready to proceed to Phase 1.*
