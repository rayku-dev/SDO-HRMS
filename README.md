# Full-Stack Authentication System Setup Guide

This guide will help you set up and run the complete authentication system with NestJS backend and Next.js frontend.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Project Structure

```
project/
├── backend/          # NestJS API
│   ├── prisma/
│   ├── src/
│   └── package.json
├── frontend/         # Next.js App
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
└── PROJECT_SETUP.md
```

## Backend Setup (NestJS)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?schema=public"

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_ACCESS_SECRET="your-super-secret-access-token-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key"

# JWT Expiration
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Application
PORT=3001
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=10
```

### 3. Set Up Database

Run Prisma migrations:

```bash
npm run prisma:migrate
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Seed the database with test users:

```bash
npm run prisma:seed
```

This creates:
- **Admin**: `admin@example.com` / `Admin@123`
- **User**: `user@example.com` / `User@123`

### 4. Start Backend Server

Development mode:

```bash
npm run start:dev
```

The API will be available at: `http://localhost:3001/api`

## Frontend Setup (Next.js)

### 1. Install Dependencies

Open a new terminal and navigate to frontend:

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
cp .env.local.example .env.local
```

The file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Frontend Server

```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

## Testing the Application

### 1. Access the Home Page

Navigate to `http://localhost:3000` to see the landing page.

### 2. Login with Test Accounts

**Regular User:**
- Email: `user@example.com`
- Password: `User@123`
- Access: User dashboard only

**Admin User:**
- Email: `admin@example.com`
- Password: `Admin@123`
- Access: User dashboard + Admin dashboard

### 3. Test Features

**Authentication Flow:**
1. Login → Receives access token (stored in sessionStorage)
2. Refresh token stored in httpOnly cookie
3. On 401 error → Automatic token refresh
4. Access protected routes

**User Dashboard:**
- View profile information
- See account status
- Access user-specific features

**Admin Dashboard:**
- View all users
- See user statistics
- Manage system (admin only)

## API Endpoints

### Authentication

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login and get tokens
POST   /api/auth/refresh       - Refresh access token
POST   /api/auth/logout        - Logout (clear current session)
POST   /api/auth/logout-all    - Logout from all devices
GET    /api/auth/me            - Get current user info
```

### Users (Protected)

```
GET    /api/users              - Get all users (ADMIN only)
GET    /api/users/profile      - Get current user profile
GET    /api/users/:id          - Get user by ID (ADMIN only)
PATCH  /api/users/profile      - Update own profile
PATCH  /api/users/:id          - Update user (ADMIN only)
DELETE /api/users/:id          - Delete user (ADMIN only)
POST   /api/users/change-password  - Change password
GET    /api/users/sessions/active  - Get active sessions
```

## Architecture Overview

### Backend (NestJS)

- **Three-Layer Authentication:**
  - Access tokens (15 min expiration) - stored in sessionStorage
  - Refresh tokens (7 days expiration) - stored in httpOnly cookies
  - Session records in database

- **Security Features:**
  - bcrypt password hashing (10 rounds)
  - JWT tokens with separate secrets
  - HTTP-only cookies for refresh tokens
  - Rate limiting
  - Helmet security headers
  - CORS protection
  - Input validation

- **Role-Based Access Control:**
  - ADMIN role: Full system access
  - USER role: Standard access
  - Guards protect routes
  - Decorators for easy role checking

### Frontend (Next.js)

- **Token Management:**
  - Access tokens in sessionStorage
  - Automatic refresh on 401 errors
  - API client with retry logic

- **Protected Routes:**
  - Middleware checks authentication
  - Role-based layout protection
  - Automatic redirect to login

- **State Management:**
  - SWR for data fetching
  - Client-side caching
  - Optimistic updates

## Database Schema

### Users Table
- id (UUID)
- email (unique)
- password (hashed)
- firstName (optional)
- lastName (optional)
- role (ADMIN | USER)
- isActive (boolean)
- createdAt
- updatedAt

### Sessions Table
- id (UUID)
- userId (FK to users)
- refreshToken (unique)
- expiresAt
- createdAt

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

**Port Already in Use:**
- Change PORT in backend/.env
- Kill process using port 3001

### Frontend Issues

**API Connection Error:**
- Verify backend is running
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS settings in backend

**Authentication Not Working:**
- Clear browser cache and cookies
- Check browser console for errors
- Verify JWT secrets are set

### Common Problems

**401 Unauthorized:**
- Token expired (should auto-refresh)
- Invalid credentials
- User account inactive

**403 Forbidden:**
- Insufficient permissions
- Wrong role for endpoint

## Production Deployment

### Backend

1. Set NODE_ENV=production
2. Use strong JWT secrets
3. Enable HTTPS
4. Configure production database
5. Set secure CORS origins
6. Enable rate limiting

### Frontend

1. Build for production: `npm run build`
2. Set production API_URL
3. Enable HTTPS
4. Configure proper CORS

## Security Best Practices

- Never commit .env files
- Use strong JWT secrets (32+ characters)
- Rotate JWT secrets regularly
- Enable HTTPS in production
- Implement rate limiting
- Use secure cookies (httpOnly, secure, sameSite)
- Hash passwords with bcrypt (10+ rounds)
- Validate all user inputs
- Implement proper CORS policies

## Development Tips

**View Database:**
```bash
cd backend
npm run prisma:studio
```

**Reset Database:**
```bash
cd backend
npm run prisma:migrate reset
npm run prisma:seed
```

**Check Logs:**
- Backend logs in terminal running NestJS
- Frontend logs in browser console
- API requests in Network tab

## Support

For issues or questions:
1. Check the README files in backend/ and frontend/
2. Review the troubleshooting section
3. Check backend logs for API errors
4. Check browser console for frontend errors
