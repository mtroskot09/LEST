# Employee Scheduling Application - Design Guidelines

## Design Approach: Modern Productivity System

**Selected Approach:** Design System (Productivity-Focused)
**Primary Inspiration:** Linear's minimal aesthetic + Google Calendar's time grid patterns
**Justification:** This is a utility-focused scheduling tool where efficiency, clarity, and data density are paramount. Users need to quickly scan schedules, drag time blocks, and manage shifts without visual distractions.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Background: 0 0% 100% (pure white)
- Surface: 220 14% 96% (light gray)
- Border: 220 13% 91% (subtle borders)
- Primary: 220 90% 56% (vibrant blue for time blocks)
- Primary Hover: 220 90% 48%
- Text Primary: 220 13% 18% (near black)
- Text Secondary: 220 9% 46% (muted gray)
- Success: 142 76% 36% (shift confirmed)
- Warning: 38 92% 50% (transfer pending)

**Dark Mode:**
- Background: 224 71% 4% (deep navy)
- Surface: 220 13% 11% (elevated cards)
- Border: 220 13% 20% (subtle borders)
- Primary: 217 92% 61% (bright blue for time blocks)
- Primary Hover: 217 92% 55%
- Text Primary: 210 40% 98% (near white)
- Text Secondary: 215 20% 65% (muted blue-gray)
- Success: 142 71% 45%
- Warning: 38 92% 58%

### B. Typography

**Font Family:** Inter (Google Fonts) for entire application

**Hierarchy:**
- Page Headers: 24px/32px, font-semibold (600)
- Section Headers: 18px/28px, font-semibold (600)
- Employee Names: 16px/24px, font-medium (500)
- Time Labels: 14px/20px, font-medium (500)
- Body Text: 14px/20px, font-normal (400)
- Helper Text: 12px/16px, font-normal (400)
- Time Block Labels: 13px/18px, font-medium (500)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Micro spacing: p-2, gap-2 (8px) - within components
- Standard spacing: p-4, gap-4 (16px) - between elements
- Section spacing: p-6, gap-6 (24px) - between sections
- Major spacing: p-8, gap-8 (32px) - page margins

**Grid Structure:**
- Time column: Fixed 80px width
- Employee columns: Flexible, minimum 200px each
- Container: max-w-7xl with responsive padding (px-4 md:px-6 lg:px-8)

### D. Component Library

**Navigation Bar:**
- Fixed top bar with app title, current week/date selector, user avatar
- Height: 64px, backdrop-blur with semi-transparent background
- Contains: Logo/Title (left), Date Navigator (center), User Menu (right)

**Calendar Time Grid:**
- Horizontal time axis showing hours (9:00, 10:00, etc.)
- Vertical employee rows with name badges on left
- 15-minute grid cells with subtle borders (1px, border color)
- Time blocks: Rounded-lg (8px), shadow-sm, with employee color coding

**Time Blocks:**
- Minimum height: 4 grid cells (1 hour display)
- Padding: p-2
- Display: Employee name, time range (e.g., "9:00 - 11:30")
- Drag handle: Subtle grip dots on left edge
- Transfer indicator: Small arrow icon on hover

**Employee Cards (Sidebar):**
- Compact cards showing: Avatar, name, total hours scheduled
- Background: Surface color, border-l-4 with employee color
- Padding: p-4, rounded-lg

**Forms & Inputs:**
- All inputs: Consistent height (h-10), rounded-md, border with focus ring
- Dark mode: Maintain dark backgrounds (bg-surface) with proper contrast
- Labels: text-sm, font-medium, mb-2
- Dropdowns: Custom styled with Heroicons chevron

**Modals:**
- Transfer confirmation: Centered overlay with backdrop-blur
- Max-width: max-w-md
- Padding: p-6
- Actions: Right-aligned with primary + secondary buttons

**Buttons:**
- Primary: bg-primary, text-white, h-10, px-4, rounded-md, font-medium
- Secondary: bg-surface, border, text-primary
- Ghost: hover:bg-surface/50 for icon buttons
- Icon-only: w-10, h-10, rounded-md

**Status Indicators:**
- Assigned: Solid primary color block
- Transfer Pending: Warning color with pulse animation
- Available: Dashed border outline

### E. Animations

**Essential Only:**
- Time block drag: opacity-50 while dragging, smooth snap-to-grid
- Transfer action: 150ms fade transition
- Modal appear/disappear: 200ms scale + fade
- Hover states: 100ms color transitions
- No scroll animations, no decorative effects

## Images

**No hero images required** - This is a utility application focused on the scheduling interface itself.

**Icons:** Use Heroicons (via CDN) for:
- Navigation icons (calendar, users, settings)
- Time block actions (transfer, edit, delete)
- Status indicators (check, clock, alert)
- Drag handles (grip-vertical)

**User Avatars:** Circular placeholders (40px) with initials on colored backgrounds

## Key Interaction Patterns

- Click empty cell: Create new time block
- Drag time block: Move within same employee column
- Drag to another column: Transfer to different employee
- Resize handles: Adjust start/end times (15-min increments)
- Right-click: Context menu for quick actions
- Double-click: Edit time block details