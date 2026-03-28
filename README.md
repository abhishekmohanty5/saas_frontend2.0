# Aegis Infra — SaaS Subscription Management Frontend

A production-grade React application for managing SaaS subscriptions, built with role-based access control, JWT authentication, AI-powered analytics, and a fully integrated Spring Boot backend deployed on Railway.

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Application Routes](#application-routes)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Deployment](#deployment)
- [Backend Requirements](#backend-requirements)

---

## Overview

Aegis Infra is a full-stack SaaS platform enabling businesses to offer tiered subscription plans to their tenants. The frontend provides:

- A public-facing landing and pricing page for plan discovery
- Secure authentication with JWT-based session management
- A user dashboard for managing personal SaaS subscriptions with analytics and renewal tracking
- A tenant-level engine subscription management portal (upgrade, pay, cancel)
- An admin panel for creating, activating, and deleting subscription plans
- AI-assisted plan generation and churn prediction

---

## Technology Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Animation | Framer Motion |
| Icons | Lucide React |
| Styling | Tailwind CSS v3, Custom CSS |
| Build Tool | Create React App (react-scripts) |
| Deployment | Vercel |

---

## Project Structure

```
saas-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js       # Role-aware route guard
│   ├── pages/
│   │   ├── LandingPage.js          # Public homepage
│   │   ├── LoginPage.js            # Login form
│   │   ├── RegisterPage.js         # Registration form
│   │   ├── AuthPage.js             # Combined auth entry
│   │   ├── PricingPage.js          # Public plan listing
│   │   ├── Dashboard.js            # User subscription dashboard
│   │   ├── SubscriptionsPage.js    # Personal subscription tracker
│   │   ├── MySubscriptionsPage.js  # Subscription detail view
│   │   └── AdminDashboard.js       # Admin plan management
│   ├── services/
│   │   └── api.js                  # Axios instances and API modules
│   ├── utils/
│   │   └── AuthContext.js          # Global auth state (Context API)
│   ├── styles/                     # Shared stylesheets
│   ├── App.js                      # Route definitions
│   ├── App.css
│   ├── index.js
│   └── index.css
├── vercel.json                     # SPA rewrite rule for Vercel
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm v8 or higher
- Backend service running (local or remote)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd saas-frontend

# Install dependencies
npm install
```

### Running Locally

```bash
npm start
```

The development server starts at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

Output is generated in the `build/` directory.

---

## Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

If this variable is not set, the application defaults to the production Railway backend:

```
https://saassubscription-production.up.railway.app/api
```

---

## Application Routes

| Route | Component | Access Level | Description |
|---|---|---|---|
| `/` | LandingPage | Public | Marketing homepage |
| `/login` | LoginPage | Public | User login |
| `/register` | RegisterPage | Public | New user registration |
| `/pricing` | PricingPage | Public | Available subscription plans |
| `/dashboard` | Dashboard | Authenticated | User and engine subscription management |
| `/subscriptions` | SubscriptionsPage | Authenticated | Personal subscription tracker |
| `/my-subscriptions` | MySubscriptionsPage | Authenticated | Subscription detail and renewal view |
| `/admin` | AdminDashboard | Admin Only | Plan creation and user management |

Protected routes are enforced through `ProtectedRoute.js` which validates the JWT token and user role stored in `localStorage`.

---

## API Integration

All HTTP communication is centralised in `src/services/api.js`. Two Axios instances are used:

- **`api`** — Authenticated instance. Automatically attaches the `Authorization: Bearer <token>` header and redirects to `/login` on a `401` response.
- **`publicApi`** — Unauthenticated instance. Used for registration, login, and public plan listing to prevent redirect loops.

### Auth Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate and receive JWT |

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/public` | Retrieve all available plans (no auth) |

### Engine Subscription Endpoints (Tenant)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tenant-admin/engine-subscription/pay` | Process mock payment |
| POST | `/tenant-admin/engine-subscription/upgrade` | Activate or upgrade a plan |
| GET | `/tenant-admin/engine-subscription` | Get current engine subscription |
| PUT | `/subscriptions/cancel` | Cancel active subscription |

### User Subscription Endpoints (Personal Tracker)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/user-Subscriptions` | Create a personal subscription record |
| GET | `/user-Subscriptions` | List all personal subscriptions |
| GET | `/user-Subscriptions/active` | List active subscriptions only |
| GET | `/user-Subscriptions/category/:id` | Filter by category |
| PUT | `/user-Subscriptions/update/:id` | Update subscription details |
| PUT | `/user-Subscriptions/cancel/:id` | Cancel a specific subscription |
| GET | `/user-Subscriptions/upcoming?days=7` | Upcoming renewals |
| GET | `/user-Subscriptions/stats` | Aggregated subscription statistics |
| GET | `/user-Subscriptions/insights` | Smart spending insights |

### Admin Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/plan` | List all plans |
| POST | `/admin/plan` | Create a new plan |
| PUT | `/admin/plan/:id/activate` | Activate a plan |
| PUT | `/admin/plan/:id/deactivate` | Deactivate a plan |
| DELETE | `/admin/plan/:id` | Delete a plan |
| GET | `/admin/users` | Retrieve all registered users |

### AI Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/v1/ai/generate-plans` | Generate plans from a business description |
| GET | `/v1/ai/analytics` | Deep subscription analytics |
| GET | `/v1/ai/predict-churn/:userId` | Churn prediction for a specific user |

---

## Authentication Flow

1. User submits credentials via `LoginPage` or `RegisterPage`.
2. The `publicApi` instance sends the request to `/auth/login` or `/auth/register`.
3. On success, the backend returns a JWT token and user object.
4. The token and user data are stored in `localStorage`.
5. `AuthContext` makes the user state globally available across components.
6. The authenticated `api` instance reads the token from `localStorage` and attaches it to every subsequent request via a request interceptor.
7. A response interceptor monitors for `401 Unauthorized` responses. If detected outside an auth page, the session is cleared and the user is redirected to `/login`.

---

## Deployment

The application is deployed on **Vercel** with a single-page application rewrite rule defined in `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all client-side routes are handled by React Router without returning a 404 from the server.

To deploy:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Set `REACT_APP_API_URL` as an environment variable in the Vercel project dashboard to point to your production backend.

---

## Backend Requirements

The Spring Boot backend must have:

- CORS configured to allow requests from the frontend origin
- JWT-based authentication returning a Bearer token on login
- All API endpoints listed in the integration section above

Example CORS configuration:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "https://your-vercel-app.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

The production backend is deployed on Railway at:

```
https://saassubscription-production.up.railway.app
```

---

## License

This project is developed as part of an MCA end-semester project.
