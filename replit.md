# Schedule Manager - Employee Time Scheduling Application

## Overview
A collaborative employee scheduling application with drag-and-drop time block management, built with React, Express, and PostgreSQL. Users can manage employee schedules, create time blocks with 15-minute precision, and transfer shifts between employees seamlessly.

## Current State
**Status:** ✅ Fully functional MVP with authentication, database persistence, and real-time collaboration

**Last Updated:** October 13, 2025

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL (Neon)
- **Authentication:** Replit Auth (OpenID Connect)
- **State Management:** React Query (TanStack Query)
- **Date Handling:** date-fns

## Core Features

### 1. User Authentication
- **Login/Logout:** Powered by Replit Auth
- **Multi-provider Support:** Google, GitHub, X, Apple, email/password
- **Session Management:** Secure cookie-based sessions with PostgreSQL storage
- **Protected Routes:** All scheduling features require authentication

### 2. Employee Management
- **CRUD Operations:** Create, read, update, delete employees
- **Color Coding:** Each employee gets a unique color for visual distinction
- **Display Order:** Employees maintain consistent ordering
- **User Isolation:** Each user manages their own team

### 3. Time Block Scheduling
- **Drag-and-Drop Interface:** Click cells to create blocks, drag to move
- **15-Minute Precision:** Time slots from 9:00 AM to 7:00 PM in 30-minute increments
- **Task Assignment:** Optional task description for each time block
- **Visual Calendar Grid:** Clean, intuitive schedule view

### 4. Shift Transfer
- **Cross-Employee Transfer:** Drag time blocks between employee columns
- **Real-time Updates:** Automatic persistence to database
- **Conflict Prevention:** Visual feedback during drag operations

### 5. Date Navigation
- **Day Navigation:** Move forward/backward by day
- **Today Button:** Quick return to current date
- **Date Display:** Clear indication of selected date

## Project Architecture

### Database Schema
```typescript
// Users (Replit Auth)
users {
  id: varchar (primary key)
  email: varchar (unique)
  firstName: varchar
  lastName: varchar
  profileImageUrl: varchar
  createdAt: timestamp
  updatedAt: timestamp
}

// Employees
employees {
  id: varchar (primary key)
  userId: varchar (foreign key)
  name: varchar
  color: varchar
  displayOrder: integer
  createdAt: timestamp
}

// Time Blocks
timeBlocks {
  id: varchar (primary key)
  userId: varchar (foreign key)
  employeeId: varchar (foreign key)
  date: varchar
  startTime: varchar
  endTime: varchar
  task: text (optional)
  createdAt: timestamp
  updatedAt: timestamp
}

// Sessions (Replit Auth)
sessions {
  sid: varchar (primary key)
  sess: jsonb
  expire: timestamp
}
```

### API Routes

#### Authentication
- `GET /api/login` - Initiate login flow
- `GET /api/callback` - OAuth callback handler
- `GET /api/logout` - Logout and clear session
- `GET /api/auth/user` - Get current user (protected)

#### Employees
- `GET /api/employees` - List user's employees (protected)
- `POST /api/employees` - Create employee (protected)
- `PATCH /api/employees/:id` - Update employee (protected)
- `DELETE /api/employees/:id` - Delete employee (protected)

#### Time Blocks
- `GET /api/timeblocks?date=YYYY-MM-DD` - List blocks for date (protected)
- `POST /api/timeblocks` - Create time block (protected)
- `PATCH /api/timeblocks/:id` - Update time block (protected)
- `DELETE /api/timeblocks/:id` - Delete time block (protected)

### Frontend Structure
```
client/src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── ThemeToggle.tsx  # Dark/light mode switcher
│   ├── EmployeeAvatar.tsx
│   ├── TimeBlock.tsx    # Individual time block component
│   ├── ScheduleGrid.tsx # Main calendar grid
│   ├── EmployeeManager.tsx
│   └── DateNavigator.tsx
├── pages/
│   ├── Landing.tsx      # Public landing page
│   ├── Schedule.tsx     # Main scheduling interface
│   └── not-found.tsx
├── hooks/
│   └── useAuth.ts       # Authentication hook
├── lib/
│   ├── queryClient.ts   # React Query setup
│   └── authUtils.ts     # Auth error handling
└── App.tsx              # Router and auth logic
```

### Backend Structure
```
server/
├── index.ts           # Express server entry
├── routes.ts          # API route handlers
├── storage.ts         # Database operations
├── replitAuth.ts      # Authentication setup
├── db.ts              # Database connection
└── vite.ts            # Vite dev server
```

## User Preferences & Workflow

### Design Preferences
- **Color Scheme:** Blue primary (#3B82F6), clean professional aesthetic
- **Dark Mode:** Fully supported with automatic theme detection
- **Typography:** Inter font family for clarity
- **Spacing:** Consistent 4/8/16/24px spacing scale

### Development Workflow
1. Database changes: Update `shared/schema.ts`, then run `npm run db:push`
2. Frontend components: Built with Shadcn UI and Tailwind
3. API routes: Keep thin, delegate to storage layer
4. State management: React Query for server state, local state for UI

## Recent Changes

### October 13, 2025
- ✅ Implemented Replit Auth for user authentication
- ✅ Created database schema with users, employees, and time blocks
- ✅ Built backend API routes with full CRUD operations
- ✅ Connected frontend to backend with React Query
- ✅ Implemented drag-and-drop shift transfer
- ✅ Added landing page for unauthenticated users
- ✅ Set up user-isolated data (each user sees only their data)

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPL_ID` - Replit application ID
- `REPLIT_DOMAINS` - Comma-separated allowed domains
- `ISSUER_URL` - OAuth issuer URL (defaults to Replit OIDC)

## Running the Application
```bash
npm run dev  # Start development server (port 5000)
npm run db:push  # Sync database schema
```

## Key Design Decisions

1. **User Isolation:** Each user has their own employees and schedules
2. **Date-Based Queries:** Time blocks fetched by date for performance
3. **Color Assignment:** Automatic color rotation for new employees
4. **Drag Transfer:** Moving blocks between columns = shift transfer
5. **Real-time Sync:** Optimistic updates with React Query
6. **Auth Flow:** Landing page for logged-out, schedule for logged-in

## Future Enhancements
- Week/month calendar views
- Recurring time blocks
- Shift templates
- Team sharing and permissions
- Export to PDF/calendar formats
- Conflict detection and warnings
- Mobile-responsive drag-and-drop
