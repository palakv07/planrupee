# PLANRUPPEE — PRODUCTIZATION MASTER PROMPT

You are the lead full-stack engineer, product architect, UI/UX engineer, AI engineer, database architect, and DevOps engineer for this project.

Your job is to transform the EXISTING PlanRupee repository into a real, production-oriented travel technology product.

Repository:
https://github.com/palakv07/planrupee

IMPORTANT:

DO NOT rebuild the project from scratch.

DO NOT throw away the existing UI.

DO NOT replace working features unnecessarily.

First inspect and understand the entire existing codebase, then progressively upgrade it.

The current project is a frontend-first React + TypeScript + Vite prototype using Context API, static data, and localStorage.

The goal is to evolve it into:

> AI-powered travel planning + verified local experts + human concierge.

Core product philosophy:

AI PLANS.
LOCALS ADVISE.
CONCIERGE EXECUTES.

---

# 1. FIRST: AUDIT THE EXISTING PROJECT

Before modifying anything, inspect:

* package.json
* src/
* all components
* contexts
* types
* data files
* roadmap generator
* local marketplace
* reviews
* booking flow
* concierge flow
* admin flow
* routing
* styling
* responsive behavior
* current deployment configuration
* README
* environment variables
* build configuration

Understand how the existing application works.

Create a temporary internal architecture assessment containing:

1. Current architecture
2. Existing features
3. Existing reusable components
4. Existing data models
5. Existing state management
6. Existing localStorage usage
7. Existing technical debt
8. Features that should be preserved
9. Features that should be refactored
10. Features that need backend support

DO NOT modify the project until this assessment is complete.

Then implement the changes incrementally.

---

# 2. PRODUCT VISION

PlanRupee should become a real travel platform.

The user journey should eventually be:

Landing Page
↓
Discover
↓
Create Trip
↓
AI-generated personalized itinerary
↓
Edit / optimize itinerary
↓
Discover places
↓
Discover verified local experts
↓
Book a local consultation
↓
Optional concierge request
↓
Trip execution
↓
Review
↓
Personalized future recommendations

The three major product layers are:

## AI

* Plans trips
* Personalizes recommendations
* Generates itineraries
* Re-plans trips
* Optimizes budgets
* Understands natural-language requests

## LOCAL EXPERTS

* Provide local knowledge
* Recommend hidden places
* Provide consultations
* Share destination-specific knowledge
* Help travelers avoid generic tourist experiences

## CONCIERGE

* Handles custom requests
* Coordinates with local partners
* Manages special requirements
* Helps execute travel plans

---

# 3. PRODUCT POSITIONING

Use this positioning consistently throughout the product:

PlanRupee

"AI-powered travel planning with local expertise and human concierge."

Core message:

"AI plans. Locals advise. Concierge executes."

Avoid generic positioning like:

"Another AI travel planner."

PlanRupee should feel like a combination of:

* intelligent itinerary planner
* local expert marketplace
* destination discovery platform
* human travel concierge

---

# 4. CURRENT FRONTEND MUST BE PRESERVED

The existing React UI is valuable.

Preserve and improve:

* Hero
* Roadmap
* Discover
* Local Marketplace
* Local Profile
* Local Booking
* Place Details
* Reviews
* User Dashboard
* Concierge
* Concierge Tracker
* Admin
* Existing visual identity

Do not replace everything with generic templates.

Improve the existing design system instead.

The final product should look polished, premium, modern, and startup-grade.

Avoid:

* excessive gradients
* generic AI-dashboard aesthetics
* unnecessary glassmorphism
* oversized animations
* clutter
* stock-template appearance

Prioritize:

* typography
* whitespace
* hierarchy
* clear CTAs
* excellent mobile experience
* accessibility
* fast interactions

---

# 5. TARGET ARCHITECTURE

Move the project toward:

Frontend
↓
Backend API
↓
PostgreSQL
↓
AI services
↓
External services

Recommended architecture:

Frontend:
React + TypeScript

Backend:
FastAPI + Python

Database:
PostgreSQL

Authentication:
JWT/session-based authentication with secure password hashing and optional Google OAuth

AI:
Provider abstraction so the LLM provider can be changed without rewriting the application

Payments:
Razorpay-ready architecture

Maps:
Provider abstraction for Google Maps / Mapbox

Email:
Provider abstraction

Deployment:
Frontend + backend + managed PostgreSQL

IMPORTANT:

Do not hard-code API keys.

All secrets must use environment variables.

---

# 6. CREATE A CLEAN MONOREPO STRUCTURE

Refactor toward:

planrupee/

frontend/
src/
public/
package.json

backend/
app/
api/
models/
schemas/
services/
repositories/
core/
db/
utils/
tests/
requirements.txt

docs/
architecture.md
api.md
product.md

.env.example

README.md

Keep the existing frontend if practical.

Do not perform a destructive rewrite.

---

# 7. DATABASE DESIGN

Create PostgreSQL models for:

## users

Fields:

* id
* name
* email
* password_hash
* avatar_url
* role
* bio
* created_at
* updated_at

Roles:

* traveler
* local
* admin

---

## trips

Fields:

* id
* user_id
* destination
* start_date
* end_date
* travelers
* budget
* currency
* travel_style
* preferences
* status
* created_at
* updated_at

---

## itinerary_days

Fields:

* id
* trip_id
* day_number
* date
* title

---

## activities

Fields:

* id
* itinerary_day_id
* place_id
* title
* description
* time_slot
* start_time
* duration_minutes
* estimated_cost
* distance_km
* recommendation_reason
* order_index

---

## places

Fields:

* id
* name
* city
* state
* country
* category
* description
* address
* latitude
* longitude
* image_url
* opening_hours
* estimated_cost
* price_level
* rating
* review_count
* best_time
* duration_minutes
* verification_status
* created_at
* updated_at

---

## locals

Fields:

* id
* user_id
* city
* bio
* expertise
* languages
* consultation_fee
* rating
* review_count
* years_local
* verification_status
* availability
* created_at
* updated_at

---

## bookings

Fields:

* id
* traveler_id
* local_id
* date
* start_time
* end_time
* fee
* payment_status
* booking_status
* notes
* created_at
* updated_at

Booking statuses:

PENDING
CONFIRMED
CANCELLED
COMPLETED

---

## reviews

Support reviews for:

* places
* locals

Fields:

* id
* user_id
* place_id nullable
* local_id nullable
* rating
* comment
* verified
* created_at

Prevent invalid reviews where neither place nor local is provided.

---

## saved_places

Fields:

* id
* user_id
* place_id
* created_at

---

## saved_locals

Fields:

* id
* user_id
* local_id
* created_at

---

## concierge_requests

Fields:

* id
* user_id
* category
* request
* destination
* preferred_date
* budget
* status
* assigned_local_id
* created_at
* updated_at

Statuses:

REQUEST_RECEIVED
UNDER_REVIEW
LOCAL_ASSIGNED
AWAITING_CONFIRMATION
CONFIRMED
IN_PROGRESS
COMPLETED
CANCELLED

---

# 8. API DESIGN

Create a clean REST API.

Authentication:

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Trips:

POST /api/trips
GET /api/trips
GET /api/trips/{id}
PUT /api/trips/{id}
DELETE /api/trips/{id}

Itinerary:

POST /api/trips/{id}/generate
PUT /api/itinerary/{id}
POST /api/itinerary/{id}/activities
DELETE /api/itinerary/{id}/activities/{activity_id}
POST /api/itinerary/{id}/optimize

Places:

GET /api/places
GET /api/places/{id}
POST /api/places
PUT /api/places/{id}

Locals:

GET /api/locals
GET /api/locals/{id}
POST /api/locals/profile
PUT /api/locals/profile

Bookings:

POST /api/bookings
GET /api/bookings
GET /api/bookings/{id}
PUT /api/bookings/{id}/status

Reviews:

POST /api/reviews
GET /api/places/{id}/reviews
GET /api/locals/{id}/reviews

Saved:

POST /api/saved/places/{id}
DELETE /api/saved/places/{id}
POST /api/saved/locals/{id}
DELETE /api/saved/locals/{id}

Concierge:

POST /api/concierge
GET /api/concierge
GET /api/concierge/{id}
PUT /api/concierge/{id}/status

AI:

POST /api/ai/plan-trip
POST /api/ai/replan-trip
POST /api/ai/chat

Admin:

GET /api/admin/dashboard
GET /api/admin/locals/pending
PUT /api/admin/locals/{id}/verify
GET /api/admin/places/pending
PUT /api/admin/places/{id}/verify
GET /api/admin/concierge

---

# 9. REMOVE localStorage AS THE SOURCE OF TRUTH

The current prototype uses localStorage.

Keep localStorage only for appropriate client-side preferences such as:

* theme
* temporary UI state
* onboarding completion
* cached non-critical data

Do NOT use localStorage as the source of truth for:

* users
* trips
* bookings
* reviews
* locals
* places
* concierge requests
* payments

Those must come from the backend/database.

Implement a service/API layer on the frontend.

For example:

services/
api.ts
authService.ts
tripService.ts
placeService.ts
localService.ts
bookingService.ts
reviewService.ts
conciergeService.ts
aiService.ts

---

# 10. AUTHENTICATION

Implement real authentication.

Requirements:

* secure password hashing
* login
* registration
* logout
* protected routes
* authenticated API requests
* role-based authorization

Roles:

TRAVELER
LOCAL
ADMIN

Create route protection.

Example:

/dashboard → authenticated traveler/local

/local/dashboard → local only

/admin → admin only

Never trust frontend role checks alone.

Backend must enforce authorization.

---

# 11. TRAVELER EXPERIENCE

Build a polished traveler flow.

## Landing

Hero:

Plan your trip.
Live it like a local.

CTA:

"Plan My Trip"

Secondary CTA:

"Explore Locals"

---

## Trip creation

Collect:

Destination
Dates
Travelers
Budget
Currency
Interests
Travel style
Pace
Food preferences
Special requirements

Example travel styles:

* Relaxed
* Balanced
* Packed
* Adventure
* Cultural
* Food-focused
* Romantic
* Family
* Budget

---

# 12. AI TRIP GENERATION

Build a HYBRID recommendation engine.

Do NOT let the LLM randomly invent everything.

Use deterministic logic for:

* budget
* opening hours
* duration
* distances
* scheduling
* availability
* duplicate places
* geographic constraints

Use AI for:

* personalization
* natural-language reasoning
* recommendation explanations
* preference interpretation
* itinerary refinement

Pipeline:

User preferences
↓
Candidate place retrieval
↓
Filtering
↓
Preference scoring
↓
Distance optimization
↓
Opening-hour validation
↓
Budget validation
↓
AI explanation
↓
Structured itinerary JSON

The AI response MUST use structured JSON.

Validate the AI response using a schema.

If AI generation fails, gracefully fall back to deterministic recommendations.

---

# 13. NATURAL LANGUAGE RE-PLANNING

Allow users to type requests such as:

"I don't want to wake up before 9."

"Replace the museum with something outdoors."

"Make Day 2 cheaper."

"I am vegetarian."

"It's raining tomorrow."

"Add one hidden local food place."

The backend should interpret the request and modify the structured itinerary.

Do NOT regenerate the entire trip unnecessarily.

Modify only the affected parts.

---

# 14. LOCAL EXPERT MARKETPLACE

Turn the existing local marketplace into a real marketplace.

Local profile must contain:

* profile photo
* name
* city
* years living locally
* expertise
* languages
* bio
* rating
* reviews
* consultation price
* availability
* verification badge

Filters:

* destination
* expertise
* price
* rating
* language

Example expertise:

Food
Culture
Nightlife
Photography
Shopping
Architecture
History
Family travel
Budget travel
Hidden gems

---

# 15. LOCAL ONBOARDING

Create:

/become-a-local

Flow:

Personal details
↓
Destination
↓
Expertise
↓
Experience
↓
Languages
↓
Consultation pricing
↓
Availability
↓
Verification submission

Status:

PENDING_VERIFICATION

Admin verifies the profile.

Only VERIFIED locals should appear in the public marketplace.

---

# 16. LOCAL DASHBOARD

Create a real local dashboard.

Show:

* profile completion
* verification status
* upcoming bookings
* past bookings
* earnings
* rating
* reviews
* availability
* consultation settings

Actions:

Accept booking
Reject booking
Reschedule
Mark completed
Update availability
Update pricing

---

# 17. BOOKING SYSTEM

Create a real booking flow.

Traveler:

Select local
↓
Choose date
↓
Choose available slot
↓
See price
↓
Confirm
↓
Payment
↓
Booking confirmation

Prevent double booking.

Availability must be validated server-side.

Booking status must be stored in PostgreSQL.

---

# 18. PAYMENT ARCHITECTURE

Prepare Razorpay integration.

Do not expose secrets in frontend.

Flow:

Frontend
↓
Backend creates payment order
↓
Razorpay
↓
Payment
↓
Webhook
↓
Backend verifies payment
↓
Booking becomes CONFIRMED

Do not trust frontend payment success alone.

Use environment variables:

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET

Create .env.example but NEVER commit actual credentials.

---

# 19. CONCIERGE SYSTEM

Turn the current simulated concierge into a real workflow.

User:

"Find a romantic dinner for two in Chandigarh."

Request enters:

REQUEST_RECEIVED

Admin/local operator can assign it.

Then:

UNDER_REVIEW
↓
LOCAL_ASSIGNED
↓
AWAITING_CONFIRMATION
↓
CONFIRMED
↓
IN_PROGRESS
↓
COMPLETED

Build a dashboard where admins can manage requests.

Users should see real-time status from the backend.

Do not use fake setTimeout status transitions.

---

# 20. REVIEWS

Implement real reviews.

Requirements:

* authenticated users only
* one review per completed booking for locals
* optionally restrict place reviews to verified visits in the future
* rating 1–5
* comment
* moderation
* verified badge where applicable

Calculate aggregate ratings server-side.

Do not trust frontend-provided rating averages.

---

# 21. ADMIN DASHBOARD

Build:

/admin

Dashboard cards:

Users
Trips
Locals
Bookings
Concierge Requests
Revenue
Pending Verification

Admin sections:

Users
Locals
Places
Reviews
Bookings
Concierge
Reports

Actions:

Verify local
Reject local
Verify place
Moderate review
Manage concierge request
View booking
View platform statistics

Backend must enforce ADMIN authorization.

---

# 22. PLACE DISCOVERY

Improve the existing Discover section.

Filters:

Destination
Category
Budget
Rating
Distance
Best time
Duration
Local recommendation

Search should be fast.

Add sorting:

Recommended
Rating
Price
Distance

Keep the existing curated data.

Prepare the architecture so external maps/place providers can be integrated later.

---

# 23. MAP ARCHITECTURE

Create a map abstraction.

Do not tightly couple the application to one provider.

Use an interface/service such as:

MapProvider

Support future:

Google Maps
Mapbox
OpenStreetMap

Places should store:

latitude
longitude

The itinerary should be capable of displaying geographic relationships.

---

# 24. NOTIFICATIONS

Create notification architecture.

Notification types:

Booking confirmed
Booking cancelled
Concierge update
Review reminder
Local verification
Payment confirmation

Start with email-ready architecture.

Create:

services/notification_service.py

Use provider abstraction.

Never hard-code a provider throughout the application.

---

# 25. SECURITY

Implement:

* password hashing
* secure authentication
* input validation
* API validation
* CORS configuration
* rate limiting where appropriate
* authorization checks
* SQL injection protection through ORM
* XSS-safe rendering
* secure environment variables
* webhook signature verification
* server-side payment verification

Never expose:

API keys
database passwords
JWT secrets
payment secrets

---

# 26. ERROR HANDLING

The application must never crash because an API request fails.

Frontend should show:

Loading state
Empty state
Error state
Retry state

Backend should return consistent errors.

Example:

{
"success": false,
"error": {
"code": "BOOKING_UNAVAILABLE",
"message": "This time slot is no longer available."
}
}

---

# 27. LOADING UX

Add proper:

* skeleton loaders
* disabled buttons
* optimistic UI only where safe
* toast notifications
* empty states

Avoid fake delays.

Do not use artificial setTimeout calls to pretend backend processing.

---

# 28. RESPONSIVE DESIGN

The product must work extremely well on:

Mobile
Tablet
Desktop

Prioritize mobile first for:

* itinerary
* place discovery
* local profiles
* booking
* concierge

Test common viewport sizes.

Fix overflow and layout issues.

---

# 29. ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus states
* proper labels
* aria attributes where necessary
* accessible modals
* sufficient contrast
* reduced-motion support

---

# 30. PERFORMANCE

Optimize:

* bundle size
* unnecessary renders
* image loading
* API calls
* database queries
* frontend state

Use lazy loading for large sections where appropriate.

Do not prematurely over-engineer.

---

# 31. TESTING

Add backend tests for:

* authentication
* authorization
* trip creation
* itinerary generation
* booking conflicts
* reviews
* concierge
* admin permissions

Add frontend tests for critical flows:

* trip creation
* itinerary display
* booking
* authentication

Also create an end-to-end smoke test:

Register
↓
Login
↓
Create trip
↓
Generate itinerary
↓
Save trip
↓
View local
↓
Book local

---

# 32. ENVIRONMENT CONFIGURATION

Create:

.env.example

Example:

DATABASE_URL=
SECRET_KEY=
JWT_SECRET=
AI_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
MAPS_API_KEY=
FRONTEND_URL=
BACKEND_URL=

Never commit .env.

Update .gitignore.

---

# 33. SEED DATA

Create backend seed scripts.

Seed:

* Chandigarh places
* Patiala places
* Rajpura places
* example verified locals
* sample reviews

Clearly mark seed/demo accounts.

Do not pretend demo data is real user data.

---

# 34. API DOCUMENTATION

FastAPI should automatically expose:

/docs

Also create:

docs/api.md

Document:

* authentication
* trips
* itinerary
* locals
* bookings
* reviews
* concierge
* AI
* admin

---

# 35. DATABASE MIGRATIONS

Use a proper migration system.

Recommended:

Alembic

Never manually recreate production tables.

Create migrations for schema changes.

---

# 36. LOGGING

Add structured backend logging.

Log:

* request
* response status
* errors
* booking events
* payment events
* AI failures

NEVER log passwords, tokens, payment secrets, or sensitive user data.

---

# 37. AI PROVIDER ABSTRACTION

Do not hard-code the entire application to one AI vendor.

Create:

AIProvider

Then implement provider adapters.

Example:

AIProvider
├── GeminiProvider
├── OpenAIProvider
└── MockAIProvider

The app should be able to run in development with MockAIProvider.

This is important for cost control.

---

# 38. COST CONTROL

This project should remain affordable during development.

Do not make an LLM call for every UI interaction.

Cache where appropriate.

Use deterministic logic for simple operations.

Only call AI when AI provides meaningful value.

Provide a development/mock mode.

---

# 39. DATA MODEL QUALITY

Use proper IDs.

Prefer UUIDs.

Use timestamps.

Use foreign keys.

Use database constraints.

Use indexes for:

* email
* city
* destination
* user_id
* local_id
* trip_id
* booking date
* verification status

---

# 40. FRONTEND STATE ARCHITECTURE

The current Context API can remain temporarily.

However, separate:

Server state
from
UI state.

Create API service functions.

Do not allow UI components to directly manipulate database-shaped state.

Example:

Component
↓
Hook/service
↓
API
↓
Backend
↓
Database

---

# 41. REMOVE DEAD / DEMO LOGIC

Search the entire codebase for:

* setTimeout used to simulate backend actions
* fake booking confirmation
* fake concierge transitions
* hard-coded user identity
* fake payment success
* development-only alerts
* unnecessary localStorage persistence
* duplicate types
* unused imports
* dead components
* console.log debugging
* placeholder data that should be database-backed

Remove or replace them appropriately.

---

# 42. README

Replace the current Vite/template README with a professional PlanRupee README.

Use the following positioning:

PlanRupee
AI-powered travel planning with local expertise and human concierge.

Core statement:

AI plans. Locals advise. Concierge executes.

Document:

* product overview
* features
* architecture
* tech stack
* project structure
* local setup
* environment variables
* backend setup
* database setup
* API
* screenshots section
* roadmap
* future architecture
* contribution instructions

Do not claim features as production-ready if they are not implemented.

---

# 43. DOCUMENTATION

Create:

docs/
architecture.md
database.md
api.md
ai-engine.md
booking-system.md
deployment.md
product-roadmap.md

Explain major architectural decisions.

---

# 44. PRODUCT ROADMAP

Implement in this order.

PHASE 1
Foundation

* backend
* PostgreSQL
* migrations
* API layer
* authentication
* environment management

PHASE 2
Core product

* trips
* itinerary persistence
* places
* saved places
* reviews

PHASE 3
Local marketplace

* local profiles
* verification
* availability
* bookings
* local dashboard

PHASE 4
AI engine

* AI trip generation
* structured output
* recommendation engine
* natural-language editing
* re-planning

PHASE 5
Payments

* Razorpay
* payment verification
* booking confirmation
* refunds architecture

PHASE 6
Concierge

* request management
* assignment
* status workflow
* notifications

PHASE 7
Production

* testing
* security
* monitoring
* deployment
* performance optimization

---

# 45. VERY IMPORTANT DEVELOPMENT RULE

Do NOT attempt to implement every phase in one huge uncontrolled rewrite.

Work incrementally.

For each phase:

1. Inspect
2. Plan
3. Implement
4. Run tests
5. Run build
6. Fix errors
7. Verify existing functionality
8. Document changes
9. Continue

Never move forward while the previous phase is broken.

---

# 46. GIT SAFETY

Before major modifications:

Create a checkpoint/commit if git is configured.

Never delete the entire project.

Never overwrite unrelated files.

Never remove existing working functionality without replacing it with an equivalent or better implementation.

---

# 47. ACCEPTANCE CRITERIA

The finished product should eventually satisfy:

### Traveler

A new user can:

Register
↓
Login
↓
Create a trip
↓
Generate itinerary
↓
Edit itinerary
↓
Save trip
↓
Discover places
↓
Discover locals
↓
Book a local
↓
Pay
↓
Receive confirmation
↓
Complete consultation
↓
Review local

### Local

A local can:

Register
↓
Create profile
↓
Submit verification
↓
Get approved
↓
Set availability
↓
Set consultation price
↓
Receive booking
↓
Accept booking
↓
Complete booking
↓
View earnings
↓
Receive review

### Admin

Admin can:

Login
↓
View dashboard
↓
Verify locals
↓
Manage places
↓
Moderate reviews
↓
Manage bookings
↓
Manage concierge requests

---

# 48. PRODUCT QUALITY BAR

Do not optimize for:

"Everything technically exists."

Optimize for:

"This feels like a real product."

Every major screen should answer:

1. What can I do here?
2. Why should I care?
3. What is the next action?

Use clear CTA hierarchy.

Avoid unnecessary modals where a dedicated page is better.

Use consistent terminology.

Use consistent spacing.

Use consistent typography.

Make empty states useful.

Make errors understandable.

---

# 49. FUTURE-READY BUT NOT OVERENGINEERED

Do NOT implement unnecessary microservices.

Start as a modular monolith:

Frontend
+
FastAPI backend
+
PostgreSQL

Keep services modular internally.

Only split infrastructure when scale actually requires it.

---

# 50. FINAL EXECUTION INSTRUCTION

Start by auditing the current repository.

Then create:

docs/current-architecture.md

with your findings.

Then propose the exact implementation sequence.

Then begin PHASE 1.

Do not ask me to manually recreate files unless absolutely necessary.

Use the existing repository.

When modifying code:

* preserve existing functionality
* keep TypeScript strict
* keep Python typed
* use clean naming
* use reusable components
* use reusable services
* avoid duplication
* add comments only where they add real value

After every major implementation:

Run:

npm install
npm run build

and for backend:

install dependencies
run migrations
run tests

Fix every build/type/test error you encounter.

At the end of each phase, provide a concise report containing:

IMPLEMENTED
CHANGED
TESTED
REMAINING
NEXT PHASE

Do not claim something is complete unless it actually works.

The ultimate goal is to transform the existing PlanRupee prototype into a maintainable, secure, scalable MVP that can eventually serve real travelers, local experts, and concierge operations.

Start with repository inspection now.
