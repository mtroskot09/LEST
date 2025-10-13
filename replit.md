# Schedule Manager - Frizerski studio LEST

## Overview
Employee scheduling application for "Frizerski studio LEST", a hair salon in Zagreb, Croatia. Features drag-and-drop time block management, username/password authentication, and bilingual support (Croatian/English).

## Current State
**Status:** ✅ Fully functional with username/password auth, Croatian/English translations, and database persistence

**Last Updated:** October 13, 2025

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL (Neon)
- **Authentication:** Username/Password (Session-based with Passport.js)
- **State Management:** React Query (TanStack Query)
- **Date Handling:** date-fns
- **Internationalization:** Custom translation system

## Core Features

### 1. User Authentication
- **Login Only:** Single admin user authentication (no registration)
- **Credentials:** Username: `admin@lest.hr` / Password: `fIqM&3G)]LRojQ4v`
- **Session Management:** Secure cookie-based sessions with PostgreSQL storage
- **Protected Routes:** All scheduling features require authentication
- **Security:** Password hashing with scrypt, sanitized user data (no password exposure)
- **Multi-language Support:** Croatian (default) and English

### 2. Language Support
- **Default Language:** Croatian (hr)
- **Supported Languages:** Croatian, English
- **Toggle:** Language switcher in header
- **Persistence:** Language preference stored in localStorage

### 3. Employee Management  
- **CRUD Operations:** Create, read, update, delete employees
- **Color Coding:** Each employee gets a unique color for visual distinction
- **Display Order:** Employees maintain consistent ordering
- **User Isolation:** Each user manages their own team

### 4. Time Block Scheduling
- **Drag-and-Drop Interface:** Click cells to create blocks, drag to move
- **15-Minute Precision:** Time slots from 9:00 AM to 7:00 PM in 30-minute increments
- **Task Assignment:** Optional task description for each time block
- **Visual Calendar Grid:** Clean, intuitive schedule view

### 5. Shift Transfer
- **Cross-Employee Transfer:** Drag time blocks between employee columns
- **Real-time Updates:** Automatic persistence to database
- **Conflict Prevention:** Visual feedback during drag operations

### 6. Date Navigation
- **Day Navigation:** Move forward/backward by day
- **Today Button:** Quick return to current date
- **Date Display:** Clear indication of selected date

## Project Architecture

### Database Schema
```typescript
// Users (Username/Password Auth)
users {
  id: varchar (primary key, UUID)
  username: varchar (unique)
  password: varchar (hashed with scrypt)
  createdAt: timestamp
  updatedAt: timestamp
}

// Employees
employees {
  id: varchar (primary key, UUID)
  userId: varchar (foreign key)
  name: varchar
  color: varchar
  displayOrder: integer
  createdAt: timestamp
}

// Time Blocks
timeBlocks {
  id: varchar (primary key, UUID)
  userId: varchar (foreign key)
  employeeId: varchar (foreign key)
  date: varchar (YYYY-MM-DD)
  startTime: varchar (HH:MM)
  endTime: varchar (HH:MM)
  task: text (optional)
  createdAt: timestamp
  updatedAt: timestamp
}

// Sessions (Express Session)
sessions {
  sid: varchar (primary key)
  sess: jsonb
  expire: timestamp
}
```

### API Routes

#### Authentication
- `POST /api/login` - Login with { username, password }
- `POST /api/logout` - Logout and clear session
- `GET /api/user` - Get current user (protected, sanitized without password)

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
│   ├── LanguageSwitch.tsx # Croatian/English toggle
│   ├── EmployeeAvatar.tsx
│   ├── TimeBlock.tsx    # Individual time block component
│   ├── ScheduleGrid.tsx # Main calendar grid
│   ├── EmployeeManager.tsx
│   └── DateNavigator.tsx
├── pages/
│   ├── Auth.tsx         # Login/Register page
│   ├── Schedule.tsx     # Main scheduling interface
│   └── not-found.tsx
├── hooks/
│   ├── useAuth.tsx      # Authentication hook & context
│   └── useLanguage.tsx  # Translation hook & context
├── lib/
│   ├── queryClient.ts   # React Query setup
│   ├── protected-route.tsx # Route protection wrapper
│   └── translations.ts  # Croatian/English translations
└── App.tsx              # Router and providers
```

### Backend Structure
```
server/
├── index.ts           # Express server entry
├── routes.ts          # API route handlers
├── storage.ts         # Database operations
├── auth.ts            # Authentication setup (passport-local)
├── db.ts              # Database connection
└── vite.ts            # Vite dev server
```

### Shared Schema
```
shared/
└── schema.ts          # Drizzle ORM schema & Zod validators
```

## User Preferences & Workflow

### Design Preferences
- **Branding:** Frizerski studio LEST, Zagreb, Croatia
- **Primary Color:** Blue (#3B82F6)
- **Languages:** Croatian (default), English
- **Typography:** Inter font family
- **Dark Mode:** Fully supported with automatic theme detection
- **Icons:** Lucide React icons, Scissors icon for branding

### Development Workflow
1. Database changes: Update `shared/schema.ts`, then run `npm run db:push`
2. Frontend components: Built with Shadcn UI and Tailwind
3. API routes: Keep thin, delegate to storage layer
4. State management: React Query for server state, local state for UI
5. Translations: Add keys to `client/src/lib/translations.ts`

## Recent Changes

### October 13, 2025
- ✅ Switched from Replit Auth to username/password authentication
- ✅ Implemented comprehensive translation system (Croatian/English)
- ✅ Updated database schema for username/password auth
- ✅ Created Auth page with login form (no registration)
- ✅ Added LanguageSwitch component with localStorage persistence
- ✅ Updated all UI components to use translations
- ✅ Fixed security vulnerabilities in PATCH endpoints (user ownership validation)
- ✅ Branded for Frizerski studio LEST hair salon
- ✅ Fixed apiRequest parameter order issues
- ✅ Updated routing: landing page (/) is login/auth, schedule at /schedule
- ✅ Fixed session cookie settings for development (secure only in production)
- ✅ Implemented user sanitization to prevent password hash exposure
- ✅ Simplified to single admin user (removed registration system)

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `NODE_ENV` - Environment (development/production)

## Running the Application
```bash
npm run dev  # Start development server (port 5000)
npm run db:push  # Sync database schema
```

## Key Design Decisions

1. **Authentication:** Username/password (not OAuth) per user request
2. **Language:** Croatian as default, English as secondary
3. **User Isolation:** Each user has their own employees and schedules
4. **Date-Based Queries:** Time blocks fetched by date for performance
5. **Color Assignment:** Automatic color rotation for new employees
6. **Drag Transfer:** Moving blocks between columns = shift transfer
7. **Real-time Sync:** Optimistic updates with React Query
8. **Protected Routes:** Landing page (/) is login/auth, schedule at /schedule route
9. **Security:** All user data sanitized before sending to client, passwords hashed with scrypt

## Translation Keys
All UI text is translated. Key translation categories:
- `appName`, `salon` - Branding
- `auth.*` - Login/register forms
- `nav.*` - Navigation and header
- `employees.*` - Employee management
- `timeBlock.*` - Time block creation
- `date.*` - Date navigation
- `messages.*` - Error/success messages

## Security Features
1. **Password Hashing:** Scrypt with random salt (cryptographically secure)
2. **Session Security:** Secure cookies in production, PostgreSQL persistence
3. **Data Sanitization:** Password hashes never sent to client or stored in sessions
4. **User Ownership:** PATCH/DELETE endpoints validate user owns the resource
5. **Input Validation:** Zod schemas for all API inputs
6. **Protected Routes:** Authentication middleware on all sensitive endpoints

## Future Enhancements
- Week/month calendar views
- Recurring time blocks
- Shift templates
- Team sharing and permissions
- Export to PDF/calendar formats
- Conflict detection and warnings
- Mobile-responsive drag-and-drop
- Additional language support (German, Italian, etc.)
