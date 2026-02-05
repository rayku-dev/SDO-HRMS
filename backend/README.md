# NestJS Authentication Backend

A production-ready NestJS backend with JWT authentication, role-based access control, and session management.

## Features

- JWT-based three-layer authentication (access token, refresh token, session)
- Role-based access control (ADMIN, USER)
- Secure password hashing with bcrypt
- Session management in PostgreSQL database
- HTTP-only cookies for refresh tokens
- Rate limiting and security headers
- Input validation with class-validator
- Global exception handling

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secrets
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Seed the database:
```bash
npm run prisma:seed
```

This will create two test users:
- Admin: `admin@example.com` / `Admin@123`
- User: `user@example.com` / `User@123`

### Running the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (clears current session)
- `POST /api/auth/logout-all` - Logout from all devices
- `GET /api/auth/me` - Get current user info

### Users (Protected)

- `GET /api/users` - Get all users (ADMIN only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get user by ID (ADMIN only)
- `PATCH /api/users/profile` - Update own profile
- `PATCH /api/users/:id` - Update user (ADMIN only)
- `DELETE /api/users/:id` - Delete user (ADMIN only)
- `POST /api/users/change-password` - Change password
- `GET /api/users/sessions/active` - Get active sessions

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── auth/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
└── package.json
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with separate secrets for access/refresh
- HTTP-only cookies for refresh tokens
- Rate limiting (configurable via env)
- Helmet security headers
- CORS protection
- Input validation and sanitization
- Session-based token management

## Environment Variables

See `.env.example` for required environment variables.

## Request Lifecycle

Understanding the NestJS request lifecycle helps clarify how authentication and authorization flow through the system:

1. **Client Request**  
   - The client (browser, mobile app, curl, Postman) sends an HTTP request to the API.

2. **Middleware**  
   - Runs before anything else.  
   - Used for logging, request modification, CORS, security headers, etc.

3. **Guards**  
   - Decide whether the request can proceed.  
   - Examples:  
     - `JwtAuthGuard` → checks if the request has a valid JWT.  
     - `RolesGuard` → checks if the user has the required role.  
   - If a guard fails, NestJS throws an exception (`UnauthorizedException` → 401, or `ForbiddenException` → 403).

4. **Interceptors (Pre-controller)**  
   - Can transform the request before it reaches the controller.  
   - Useful for caching, logging, or wrapping responses.

5. **Pipes**  
   - Validate and transform incoming data before it hits the controller.  
   - Example: `ValidationPipe` ensures DTOs are valid.

6. **Controller Route Handler**  
   - The actual method in your controller executes.  
   - Example: `UsersController.findAll()`.

7. **Interceptors (Post-controller)**  
   - Can transform or log the response before it’s sent back to the client.

8. **Exception Filters**  
   - Catch and format errors thrown anywhere in the lifecycle.  
   - Example: `HttpExceptionFilter` for consistent error responses.

9. **Response Sent to Client**  
   - The final JSON or error message is returned to the client.
