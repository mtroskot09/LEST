# Schedule Manager - Testing Guide

## Manual Testing Checklist

### Authentication Flow
- [ ] Landing page displays for unauthenticated users
- [ ] "Sign In" and "Get Started" buttons navigate to login
- [ ] Replit Auth login works (Google, GitHub, email, etc.)
- [ ] After login, user is redirected to schedule page
- [ ] User avatar displays in header with initials/image
- [ ] Logout button works and returns to landing page
- [ ] Unauthorized API requests trigger re-login

### Employee Management
- [ ] Add new employee with unique name
- [ ] Employee appears in list with assigned color
- [ ] Colors rotate through palette (blue, green, orange, purple, red)
- [ ] Edit employee name
- [ ] Delete employee (removes associated time blocks)
- [ ] Employee list persists across sessions

### Schedule Grid
- [ ] Time grid displays 9:00 AM - 7:00 PM slots
- [ ] Click empty cell to create time block
- [ ] Time block dialog validates start/end times
- [ ] Time block appears in correct cell with color
- [ ] Task description displays in block
- [ ] Hover shows delete button on time blocks

### Drag and Drop
- [ ] Drag time block to different time slot (same employee)
- [ ] Time block updates position
- [ ] Drag time block to different employee column
- [ ] Block transfers to new employee
- [ ] Cannot transfer to other user's employees (403 error)
- [ ] Drag visual feedback (opacity changes)

### Date Navigation
- [ ] Previous day button works
- [ ] Next day button works
- [ ] "Today" button returns to current date
- [ ] Date display updates correctly
- [ ] Time blocks filter by selected date

### Data Isolation
- [ ] Each user sees only their own employees
- [ ] Each user sees only their own time blocks
- [ ] Cannot access other users' data via API

### UI/UX
- [ ] Dark mode toggle works
- [ ] Theme persists across sessions
- [ ] Responsive layout on mobile/tablet
- [ ] Loading states display during API calls
- [ ] Error toasts show for failed operations
- [ ] Success feedback for create/update/delete

## Automated Test Coverage

### ✅ Completed Tests

#### Landing Page (Unauthenticated)
- Landing page renders with correct content
- "Sign In" and "Get Started" buttons are visible
- Theme toggle switches between light/dark mode
- Dark mode class applied to HTML element
- Feature cards display correctly

### 🔄 Requires Manual Testing (Replit Auth)

These features require authenticated sessions and cannot be fully automated:

1. **Login Flow**
   - Replit Auth provider selection
   - OAuth callback handling
   - Session creation and persistence

2. **Authenticated Schedule Operations**
   - Employee CRUD operations
   - Time block creation and updates
   - Drag-and-drop transfers
   - Multi-user data isolation

## Security Test Scenarios

### ✅ Verified

1. **PATCH Endpoint Protection**
   - Cannot change userId via PATCH /api/employees/:id
   - Cannot change userId via PATCH /api/timeblocks/:id
   - Update schemas exclude userId field

2. **Employee Transfer Validation**
   - Can only transfer blocks to own employees
   - 403 error when transferring to other user's employees
   - employeeId ownership verified before update

3. **Authorization Checks**
   - All employee/timeblock endpoints require authentication
   - Ownership verified before update/delete operations
   - 404 returned for records owned by other users

### Manual Security Tests

1. **Cross-Tenant Isolation**
   - [ ] User A cannot see User B's employees
   - [ ] User A cannot modify User B's time blocks
   - [ ] API returns 404 for other users' resources

2. **Session Management**
   - [ ] Session expires after 1 week
   - [ ] Refresh token updates session
   - [ ] Logout clears session completely

## Performance Testing

- [ ] Page loads in < 2 seconds
- [ ] API responses in < 500ms
- [ ] Smooth drag-and-drop (no jank)
- [ ] Database queries optimized (indexed lookups)

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

## Known Limitations

1. **Drag-and-Drop**: Requires mouse/touch - keyboard navigation not supported
2. **Time Slots**: Fixed 30-minute grid intervals
3. **Date Range**: Single day view only (no week/month views)
4. **Collaboration**: Real-time updates require page refresh

## Bug Report Template

```
**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: 
- Date/Time: 
- User ID (if known): 

**Screenshots/Logs:**
[Attach relevant images or console logs]
```
