# Project Connect - Task & Implementation Roadmap

## 1. Simplified High-Level Tasks
1. Foundation & Authentication (Phase 1: Sprints 1-2)
2. Creator Suite MVP (Phase 1: Sprints 3-4)
3. AI Co-Pilot & Publishing (Phase 1: Sprints 5-6)
4. Consumer App & Marketplace MVP (Phase 1: Sprints 7-8)
5. Creator Seeding & Onboarding (Phase 2: Sprints 9-10)
6. Public Launch & Community Features (Phase 2: Sprints 11-12)
7. Analytics & Gamification (Phase 2: Sprints 13-14)

## 2. Complexity Analysis
| Task                                              | Complexity |
|---------------------------------------------------|------------|
| Foundation & Authentication                       | High       |
| Creator Suite MVP                                 | High       |
| AI Co-Pilot & Publishing                          | High       |
| Consumer App & Marketplace MVP                    | High       |
| Creator Seeding & Onboarding                      | Medium     |
| Public Launch & Community Features                | Medium     |
| Analytics & Gamification                          | Medium     |

## 3. Task Decomposition (Complex → Simple)
_High-complexity tasks are broken down into low-complexity units._

### 3.1 Foundation & Authentication
- Setup project repo, monorepo structure, and core dependencies
- Configure TypeScript, linting, formatting, and CI
- Define database schema/migrations for Users & Creators tables
- Implement registration endpoint (`POST /auth/register`)
- Implement login endpoint (`POST /auth/login`) with JWT issuance
- Implement token refresh flow and secure storage
- Integrate OAuth2 (Google, Apple) for social login
- Enforce password policy and implement Argon2 password hashing
- Implement MFA setup and verification
- Write unit and integration tests for auth flows

### 3.2 Creator Suite MVP
- Bootstrap Next.js + TypeScript web app under `/apps/web`
- Configure React, Next.js routing, and shared layout components
- Implement Creator Dashboard page skeleton
- Scaffold Pack Builder UI:
  - Card list view by level
  - "Add Card" modal stub (no backend integration)
  - Drag-and-drop ordering UI
- Create REST client module for creator endpoints
- Integrate Storybook for isolated component development
- Write unit tests for Dashboard and Pack Builder components

### 3.3 AI Co-Pilot & Publishing
- Create `llm-service` package for LLM API integration
- Implement prompt-chaining wrapper functions:
  - `ideationPrompt`
  - `structuringPrompt`
  - `contentGenerationPrompt`
  - `refinementPrompt`
- Expose Co-Pilot endpoints in the Creator microservice:
  - `POST /creator/packs/{id}/ideation`
  - `POST /creator/packs/{id}/structure`
  - `POST /creator/packs/{id}/content`
  - `POST /creator/packs/{id}/refinement`
- Implement pack submission workflow:
  - `POST /creator/packs/{id}/submit` (status change and moderation enqueue)
- Define DB model and migrations for `ModerationLog`
- Write unit and integration tests for Co-Pilot and publishing flows

### 3.4 Consumer App & Marketplace MVP
- Bootstrap React Native + TypeScript mobile app under `/apps/mobile`
- Configure navigation stack (React Navigation)
- Implement Home Screen stub with placeholder carousels
- Scaffold Marketplace List and Detail screens
- Integrate API client for public pack endpoints
- Stub purchase flow UI (in-app purchase & Stripe placeholder)
- Write UI tests for key mobile screens

### 3.5 Creator Seeding & Onboarding
- Implement Creator Onboarding flow in web app:
  - Stripe Connect integration stub + Terms checkbox UI
  - Create or update Creator profile via onboarding API
- Create backend endpoints for onboarding:
  - `POST /creator/onboard`
  - `GET /creator/status`
- Write tests for onboarding endpoints and UI

### 3.6 Public Launch & Community Features
- Implement Ratings & Reviews UI in web and mobile apps
- Create endpoints for reviews and follows:
  - `POST /packs/{id}/reviews`, `GET /packs/{id}/reviews`
  - `POST /creators/{id}/follow`, `DELETE /creators/{id}/follow`
- Add DB migrations for `Reviews` and `Follows` tables
- Write unit and integration tests for social endpoints

### 3.7 Analytics & Gamification
- Build Creator Analytics Dashboard UI with placeholder charts
- Create analytics endpoints:
  - `GET /creator/analytics/sales`
  - `GET /creator/analytics/engagement`
- Implement streaks and badges data model and endpoints:
  - DB schema for `Streaks`, `Badges`
  - `GET /users/{id}/badges`
  - `POST /sessions/{id}/complete` (streak update)
- Write tests for analytics and gamification services

## 4. Dependency Analysis & Prioritization
The following table lists all decomposed tasks with their dependencies and suggested priority order.

| Priority | Task                                                                                | Depends On                                         |
|----------|-------------------------------------------------------------------------------------|----------------------------------------------------|
| 1        | Setup project repo, monorepo structure, and core dependencies                       | —                                                  |
| 2        | Configure TypeScript, linting, formatting, and CI                                   | 1                                                  |
| 3        | Define database schema/migrations for Users & Creators tables                       | 1, 2                                               |
| 4        | Implement registration endpoint (`POST /auth/register`)                             | 3                                                  |
| 5        | Implement login endpoint (`POST /auth/login`) with JWT issuance                     | 3                                                  |
| 6        | Implement token refresh flow and secure storage                                     | 4, 5                                               |
| 7        | Integrate OAuth2 (Google, Apple) for social login                                   | 4, 5                                               |
| 8        | Enforce password policy and implement Argon2 password hashing                       | 4                                                  |
| 9        | Implement MFA setup and verification                                               | 5, 8                                               |
| 10       | Write unit and integration tests for auth flows                                     | 4–9                                                |
| 11       | Bootstrap Next.js + TypeScript web app under `/apps/web`                            | 2                                                  |
| 12       | Configure React, Next.js routing, and shared layout components                      | 11                                                 |
| 13       | Implement Creator Dashboard page skeleton                                          | 12                                                 |
| 14       | Scaffold Pack Builder UI (list view, add modal stub, drag-and-drop)                 | 12                                                 |
| 15       | Create REST client module for creator endpoints                                    | 4                                                  |
| 16       | Integrate Storybook for isolated component development                              | 12                                                 |
| 17       | Write unit tests for Dashboard and Pack Builder components                          | 13–16                                              |
| 18       | Create `llm-service` package for LLM API integration                                 | 2                                                  |
| 19       | Implement prompt-chaining wrapper functions                                         | 18                                                 |
| 20       | Expose Co-Pilot endpoints in the Creator microservice                                | 19                                                 |
| 21       | Define DB model and migrations for `ModerationLog`                                   | 3                                                  |
| 22       | Implement pack submission workflow (status change and moderation enqueue)           | 20, 21                                             |
| 23       | Write unit and integration tests for Co-Pilot and publishing flows                   | 19–22                                              |
| 24       | Bootstrap React Native + TypeScript mobile app under `/apps/mobile`                  | 2                                                  |
| 25       | Configure navigation stack (React Navigation)                                        | 24                                                 |
| 26       | Implement Home Screen stub with placeholder carousels                                | 25                                                 |
| 27       | Scaffold Marketplace List and Detail screens                                        | 25                                                 |
| 28       | Integrate API client for public pack endpoints                                      | 4                                                  |
| 29       | Stub purchase flow UI (in-app purchase & Stripe placeholder)                         | 27, 28                                             |
| 30       | Write UI tests for key mobile screens                                               | 26–29                                              |
| 31       | Implement Creator Onboarding flow in web app (Stripe stub, Terms checkbox)           | 11                                                 |
| 32       | Create backend endpoints for onboarding (`POST /creator/onboard`, `GET /creator/status`)| 4                                             |
| 33       | Write tests for onboarding endpoints and UI                                         | 31–32                                             |
| 34       | Implement Ratings & Reviews UI in web and mobile apps                               | 11, 24                                            |
| 35       | Create endpoints for reviews (`POST /packs/{id}/reviews`, `GET /packs/{id}/reviews`)| 4                                                  |
| 36       | Implement "Follow Creator" feature (UI and backend endpoints)                      | 11, 35                                             |
| 37       | Write unit and integration tests for social features                                | 34–36                                             |
| 38       | Build Creator Analytics Dashboard UI with placeholder charts                       | 11                                                 |
| 39       | Create analytics endpoints (`GET /creator/analytics/sales`, `GET /creator/analytics/engagement`)| 4                                          |
| 40       | Implement streaks and badges data model and endpoints                              | 3                                                  |
| 41       | Write tests for analytics and gamification services                                 | 38–40                                             |

---
*This file will be updated iteratively: after implementation, new tasks and priorities will be added as needed.*