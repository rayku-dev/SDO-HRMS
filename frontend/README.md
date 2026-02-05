# Next.js Authentication Frontend

A modern Next.js frontend with JWT authentication, role-based dashboards, and automatic token refresh.

## Features

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- SWR for data fetching and caching
- Automatic token refresh on 401 errors
- sessionStorage for access tokens
- Role-based routing (user and admin dashboards)
- Protected routes with middleware
- Responsive design with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+
- Running backend API (see backend/README.md)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   └── admin/
├── components/
│   └── ui/
├── lib/
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-users.ts
│   ├── auth.ts
│   └── utils.ts
├── middleware.ts
└── package.json
```

## Authentication Flow

1. User logs in via `/login`
2. Access token stored in sessionStorage
3. Refresh token stored in httpOnly cookie
4. On 401 error, automatic token refresh attempt
5. User redirected to login if refresh fails

## Available Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard (protected)
- `/admin` - Admin dashboard (protected, ADMIN role only)

## Environment Variables

See `.env.local.example` for required environment variables.
